const express = require('express');
const router = express.Router();
const Config = require('../models/model-config')

router.get('/', async(req,res) => {
  try{
      const configs = await Config.find()
      res.json(configs)
  }catch(err){
      res.send('Error ' + err)
  }
})

router.get('/:id', async(req,res) => {
  try{
         const config = await Config.findById(req.params.id)
         res.json(config)
  }catch(err){
      res.send('Error ' + err)
  }
})


router.post('/', async(req,res) => {
  const config = new Config(req.body)

  try{
      const a1 =  await config.save() 
      res.json(a1)
  }catch(err){
      res.send('Error')
  }
})

router.patch('/:id/orders',async(req,res)=> {
  try{
      const config = await Config.findById(req.params.id) 
      config.orderHistory.push(req.body)
      const a1 = await config.save()
      res.json(a1)   
  }catch(err){
      res.send(err)
  }
})

router.patch('/:id/orders/:id2',async(req,res)=> {
  try{
      const config = await Config.findById(req.params.id) 
      for (let i =0 ; i< config.orderHistory.length;i++){
        if (config.orderHistory[i].root == req.params.id2){
          config.orderHistory[i] = req.body
        }
      }
      const a1 = await config.save()
      res.json(a1)   
  }catch(err){
      res.send(err)
  }
})

module.exports = router