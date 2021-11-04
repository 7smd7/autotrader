const Config = require('../models/model-config')
const seedData = require('./configSeeds.json') 

const configSeeds = () => {Config.deleteMany({})
  .then(() => {
    return Config.insertMany(seedData)
 })
 .then(console.log("seedData added"))
 .catch(console.error)
 .finally(() => {
  // process.exit()
 })}

module.exports = configSeeds