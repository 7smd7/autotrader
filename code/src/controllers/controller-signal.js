const express = require('express');
const router = express.Router();
const Signal = require('../models/model-signal')

router.get('/', async(req,res) => {
  try{
      const signals = await Signal.find()
      res.json(signals)
  }catch(err){
      res.send('Error ' + err)
  }
})

router.get('/:id', async(req,res) => {
  try{
         const signal = await Signal.findById(req.params.id)
         res.json(signal)
  }catch(err){
      res.send('Error ' + err)
  }
})


router.post('/', async(req,res) => {
  const signal = new Signal(req.body)
  try{
      const a1 =  await signal.save() 
      res.json(a1)
  }catch(err){
      res.send(err)
  }
})

module.exports = router