const getResponse = require('../util/reponse_builder')
const timer = require('../util/timer');
const moment = require('moment')
const publicIp = require('public-ip');
const humanizeDuration = require('humanize-duration');
const config = require('../../config');

moment().format(); 
const durationMapper = {
    'stunden': 'h',
    'stunde': 'h',
    'minuten': 'm',
    'sekunden': 's'
}
const options = {
    language: 'de',
    round: true,
    conjunction: " und "
}


function SetTimer(slots, name){
    if(name){
        switch (name.toLowerCase()) {
            case 'eier':
                duration = moment.duration({
                    minutes: 6
                })
                timeFlag = "m"
                break
            case 'wäsche':
                duration = moment.duration({
                    minutes: 50,
                    hours: 1
                })
                timeFlag = "h"
                break
        }
    } else {
        timeFlag = durationMapper[slots.timeType.toLowerCase()]
        durationObj = {}
        durationObj[timeFlag] = slots.time
        duration = moment.duration(durationObj)
    }
    // Calculate EndTime
    var endTime = moment().add(duration)
    // Store Duration as humanized string
    // Humanize the duration
    var humanizedDuration = humanizeDuration(duration.asMilliseconds(), {
        language: 'de'
    })
    return timer.createTimer(name, endTime.valueOf(), humanizedDuration, timeFlag)
}

async function GetRemainingTime(t_name){
    var timers = await timer.getRemainingTime(t_name)
    console.log(timers)
    // I can't remember what this condition did, and why it is here in the first place
    if (typeof timers == "string"){
        return timers
    } 
    else {
        var response = ""
        if(timers.length == 1){
            var humanizedDuration = humanizeDuration(timers[0].remaining, options)
            response = getResponse("timer", "getRemainingTimeSingle", [t.name, humanizedDuration])
        } else {
            timers.forEach(t => {
                var humanizedDuration = humanizeDuration(t.remaining, options)
                response +=  getResponse("timer", "getRemainingTime", [t.name, humanizedDuration])
            });
        }
        return response
    }
}

module.exports = async function (action, slots) {
    console.log("Retrieved slots+action @timer: ")
    console.log(action, slots)
    // Extract the name if we have one
    if(slots) t_name = slots.name 
    else t_name = undefined   

    // Check if our public IP changed
    let publicIP = await publicIp.v4()
    
    if(publicIP != config.publicIP){
        console.log(`Address changed - unable to ping API, ${publicIP}`)
        return getResponse("timer", "ipAddressChanged")
    }
    switch (action) {
        case "SetTimer":    
            response = SetTimer(slots, t_name)
            break;
        case "GetRemainingTime":
            response = await GetRemainingTime(t_name)
            break;
        case "DeleteTimer":
            response = await timer.deleteTimer(t_name)
            break;
    }
    return response
}