const ccxt = require('ccxt');
const express = require("express");
const localtunnel = require('localtunnel');
const router = express.Router();
const axios = require('axios');


base_url = "http://localhost:3001"

function Order(strategy ,side, tiker, market, amount, root, rootCost, stopLoss, takeProfit){
    this.time = (new Date()).getTime()
    this.PAL = - rootCost;
    this.status = "open"
    this.side = side;
    this.tiker = tiker;
    this.market = market;
    this.amount = amount;
    this.root = root;
    this.rootCost = rootCost;
    this.stopLoss = stopLoss;
    this.stopLossCost = 0;
    this.takeProfit = takeProfit;
    this.takeProfitCost = 0; 
    this.strategy = strategy;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const createOrder = async function (exchange,config){
    const {id, strategy, allocation, takeProfit, stopLoss, base, quote, side, price} = config;
    const market = `${base}/${quote}`;
    let balance = await fetchBalance(base,exchange);
    let baseBalance = balance ? balance : 0 ;
    balance = await fetchBalance(quote, exchange);
    let quoteBalance = balance ? balance : 0 ;

    // const amount = (side == 'buy') ? (allocation * quoteBalance)/price: baseBalance; //origin
    // const amount = (side == 'buy') ? (allocation * quoteBalance)/price: baseBalance*allocation ; //test
    amount =1;

    const rootOrder = await exchange.createOrder(market, 'limit', side, amount, price);
    console.log(id + " root order " + rootOrder.id);

    valid = true;
    while (valid){
        const order = await exchange.fetchOrder(rootOrder.id);
        if (order.status != 'open')
            valid = false;
    }

    const order = await exchange.fetchOrder(rootOrder.id);
    if (order.status != 'closed')
        return

    const invertedSide = (side == 'buy') ? 'sell' : 'buy';

    const stopLossParams = {
        stop : (side == 'buy') ? 'loss' : 'entry' ,
        stopPrice: (side == 'buy') ? price*(1-stopLoss) : price*(1+stopLoss),
    }
    const stopLossOrder = await exchange.createOrder(market, 'market', invertedSide, amount, null, stopLossParams);
    console.log(id + " stop loss order " + stopLossOrder.id);

    const takeProfitParams = {
        stop : (side == 'buy') ? 'entry' : 'loss',
        stopPrice: (side == 'buy') ? price*(1+takeProfit) : price*(1-takeProfit),
    }
    const takeProfitOrder = await exchange.createOrder(market, 'market', invertedSide, amount, null, takeProfitParams);
    console.log(id + " take profit order " + takeProfitOrder.id);


    const orders = new Order(strategy, side, base, quote, amount, rootOrder.id, order.cost, stopLossOrder.id, takeProfitOrder.id)

    axios.patch(base_url + "/configs/"+id+"/orders",orders)
    .then((response) => {
        console.log( id + " submit new set orders.")
    }).catch(function (error) {
        console.log(error);
      })
}

const checkStopOrders = async ()=>{
    while(true){
        await sleep(5000)
        axios.get(base_url + "/configs")
        .then((response) => {
            response.data.forEach(config => {
                const exchange = new ccxt.kucoin({
                    'id' : config._id,
                    'apiKey': config.apiKey,
                    'secret' : config.secret,
                    'password' : config.password,
                    'timeout': 30000,
                    'enableRateLimit': true,
                })
                exchange.fetchClosedOrders().then(closedOrders =>{
                    let cancelid = []
                    for (let i of closedOrders){
                        cancelid.push(i.id)
                    }
                    config.orderHistory.forEach(orders =>{
                        if (orders.status == "open"){
                            if (cancelid.includes(orders.stopLoss)){
                                exchange.cancelOrder(orders.takeProfit).then(cancel => {
                                    orders.status="closed";
                                    exchange.fetchOrder(orders.stopLoss).then(stopLoss =>{
                                        orders.PAL = -Math.abs(orders.PAL + stopLoss.cost);
                                        orders.stopLossCost = stopLoss.cost;
                                        axios.patch(base_url + "/configs/"+config._id+"/orders/"+orders.root,orders)
                                        .then((response) => {
                                            console.log( orders.stopLoss + " cancelled.")
                                        }).catch(function (error) {
                                            console.log(error);
                                          })
                                    })
                                });
                            }
                            else if (cancelid.includes(orders.takeProfit)){
                                exchange.cancelOrder(orders.stopLoss).then( cancel =>{
                                    orders.status="closed";
                                    exchange.fetchOrder(orders.takeProfit).then(takeProfit => {
                                        orders.PAL = Math.abs(orders.PAL + takeProfit.cost);
                                        orders.takeProfitCost = takeProfit.cost;
                                        axios.patch(base_url + "/configs/"+config._id+"/orders/"+orders.root,orders)
                                        .then((response) => {
                                            console.log( orders.takeProfit + " cancelled.")
                                        }).catch(function (error) {
                                            console.log(error);
                                          })
                                    });
                                });
                            }

                        }
                    })
                })
            })
        }).catch(function (error) {
            console.log(error);
        })
    }
}

const fetchBalance = async (currency, exchange) =>{
    const balances = await exchange.fetchBalance();
    const balance = balances.free[currency];
    return balance;
}

exchanges = []

axios.get(base_url + "/configs")
.then((response) => {
    response.data.forEach(config =>{
        const exchange = new ccxt.kucoin({
            'id' : config._id,
            'apiKey': config.apiKey,
            'secret' : config.secret,
            'password' : config.password,
            'timeout': 30000,
            'enableRateLimit': true,
        })
        exchanges.push(exchange)
    })
}).catch(function (error) {
    console.log(error);
})

router.use("",express.text())

router.all("", (req, res) => {
    const body = req.body.replace("[","").replace("]","");
    query = JSON.parse(body);
    query.time = (new Date()).getTime();
    query.signal = query.signal.toLowerCase();

    axios.post(base_url + "/signals",query)
    .then((response) => {
        console.log(response.data)
    }).catch(function (error) {
        console.log(error);
      })
    config={}
    if (query.signal != 'none'){        
        exchanges.forEach(exchange =>{
            config.strategy = query.name;
            config.side = query.signal;
            config.price = query.limit;
            config.base = query.tiker;
            config.quote = query.market;
            config.takeProfit = query.TP/100;
            config.stopLoss = query.SL/100;
            config.id = exchange.id;
            createOrder(exchange,config);
        })
    }
});

(async () => {
    const tunnel = await localtunnel({ port: 3001, subdomain: "daryani"});
    console.log(tunnel.url);
    // tunnel.close();
})();


module.exports = router;
checkStopOrders();