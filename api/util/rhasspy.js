const http = require('wretch')

/**
 * This module contains standard rhasspy functionality 
 */

 /**
  * Speaks to the user
  */
function speakText(text){
  http('http://192.168.0.235:12101/api/text-to-speech?repeat=false&play=true')
  .post(text)
}

module.exports = {
  speakText
}