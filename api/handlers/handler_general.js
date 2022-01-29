const getResponse = require('../util/reponse_builder')

// General intent handling
// Used for all porcupine specific functions 
// Adaptions could be, state, feeling, jokes, etc. Anything that has interaction elements

module.exports = async function (action, slots) {
    console.log("Retrieved slots+action @general: ")
    console.log(action, slots)
    response = ""
    // React on action
    switch (action) {
        case "DoNothing":
            response = getResponse("general", "doNothing")
            break;
        case "Thanks":
            response = getResponse("general", "thanks")
            break;
    }
    return response
}



