const mongoose = require('mongoose')
const SignalSchema = new mongoose.Schema (
{
    time:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    tiker:{
        type: String,
        required: true,
        trim: true,
    },
    market:{
        type: String,
        required: true,
        trim: true,
    },
    signal: {
        type: String,
        required: true,
        trim: true,
        enum: ['buy', 'sell', 'none']
    },
    limit: {
        type: Number,
        required: true,
    },
    SL: {
        type: Number,
        required: true,
    },
    TP: {
        type: Number,
        required: true,
    },
});

const Signal = mongoose.model('Signal', SignalSchema);

module.exports = Signal;