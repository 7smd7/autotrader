const mongoose = require('mongoose');
const url = 'mongodb://localhost/AutoTrader'
const configSeeds = require('./configSeeds.js')

mongoose.connect(url, {useNewUrlParser: true})
const con = mongoose.connection


con.on('open',function(){
    console.log("Database connected...")
    // configSeeds()
})
module.exports = mongoose