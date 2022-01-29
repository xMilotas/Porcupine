const lights = require("./handler_lights")
const spotify = require('./handler_spotify')
const shoppingList = require('./handler_shoppingList')
const timer = require('./handler_timer')
const general = require('./handler_general')

module.exports = {
    spotify,
    lights,
    timer,
    shoppingList,
    general
}