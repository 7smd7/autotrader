const express = require('express');
const connection = require('../db/connection');

const app = express();
app.use(express.json())

const configController = require('../controllers/controller-config.js');
app.use('/configs', configController)

const signalController = require('../controllers/controller-signal.js');
app.use('/signals', signalController)

const robot = require('./robot.js');
app.use('/', robot)

app.listen(3001,function(){
    console.log('Server started')
})

module.exports = app;