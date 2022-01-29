const express = require('express')
const router  = express.Router()
const config = require('../config')
const handlers = require('./handlers')
const getResponse = require('./util/reponse_builder')

intentMap = {
  "Spotify": handlers.spotify,
  "Timer": handlers.timer,
  "ShoppingList": handlers.shoppingList,
  "Lights": handlers.lights,
  "General": handlers.general
}

var response = "Text"

// Main intent recognition
function extractInfos(req){
    var intent = req.intent
    if(intent.confidence < config.confidenceThreshhold){
      if (intent.name) response = getResponse("general", "error")
      return {undefined, undefined}
    }
    else {
      var slots = req.slots
      var name = intent.name
      // If the slots field wasn't provisioned, build it ourselves from the entity object
      if(!slots){
        console.log("Slots field not provisioned, extracting from entities")
        var ent = req.entities
        if(ent.length > 0){
          slots = {}
          ent.forEach(element => {
            slots[element.entity] = element.value
          });
        }
      }
      return {name, slots}
    }
}

router.post('/', async (req, res) => {
    console.log(`Recieved an API call`)
    console.log(req.body)
    // Extract intent and slots from message
    var {name, slots} = extractInfos(req.body)
    console.log(`Extracted the following information. Name: ${name}, Slots:`)
    console.log(slots)
    // Handle intent
    try {
      if(name){
        temp = name.split(":")
        handler = temp[0]
        action = temp[1]
        console.log(handler, action)
        response = await intentMap[handler](action, slots)
      }
    } 
    catch (error) {
      console.log(`Caught an error, ${error}`)
      response = getResponse("general", "error")
    }
    res.send({
      "speech": {
        "text": response
      }
    })
})

module.exports = router


