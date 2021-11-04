const mongoose = require('mongoose')
const ConfigSchema = new mongoose.Schema (
{
    name: {
        type: String,
        required: true,
        trim: true
        },
    apiKey: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    secret: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    allocation: {
        type: Number,
        required: true,
    },
    orderHistory : [{
        time:{
            type: Number,
            required: true,
        },
        status:{
            type: String,
            required: true,
            default: 'open',
            enum: ['open', 'closed', 'canceled', 'expired']
        },
        side: {
            type: String,
            required: true,
            trim: true,
            enum: ['buy', 'sell']
        },
        amount: {
            type: Number,
            required: true,
        },
        root: {
            type: String,
            required: true,
        },
        rootCost: {
            type: Number,
            required: true,
        },
        stopLoss: {
            type: String,
        },
        stopLossCost: {
            type: Number,
        },
        takeProfit: {
            type: String,
        },
        takeProfitCost: {
            type: Number,
        },
        PAL: {
            type: Number,
        },
        market:{
            type: String,
            required: true,
            trim: true,
        },
        tiker:{
            type: String,
            required: true,
            trim: true,
        },
        strategy:{
            type: String,
            required: true,
            trim: true,
        }
    }],
});

const Config = mongoose.model('Config', ConfigSchema);

module.exports = Config;