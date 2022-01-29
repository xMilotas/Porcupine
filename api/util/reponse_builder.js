/**
 * This module aims to feature a more natural look and feel when talking to 
 * porcupine by mixing up responses from time to time. 
 * It takes a "speechIntent" and looks it up from a list of sample responses
 * 
 * These should be maintained in "replies.json" file.
 */

const replies = require('./replies.json')

/**
 * 
 * @param {string} speechIntent 
 * @param {string} content 
 */
module.exports = function(caller, speechIntent, content = []){
    var responses = replies[caller][speechIntent]
    if(typeof content == "string") content = [content]
    // Get random reply - thanks SO :)
    var response = responses[Math.floor(Math.random() * responses.length)];
    item = content[0] || ""
    item2 = content[1] || ""
    response = response.replace("${item}", item).replace("${item2}", item2)
    return response
}