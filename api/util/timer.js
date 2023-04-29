const http = require('wretch')
const fs = require('fs')
const mongoose = require('mongoose')
const Timer = require('./model')
const rhasspy = require('./rhasspy');
const moment = require('moment')
const path = require('path')
const config = require('../../config')
const getResponse = require('./reponse_builder')

let globalIntervalID
let globalIntervalType 

async function findAndDeleteTimer(tname) {
    return await Timer.findOneAndDelete({
        name: tname
    })
}

async function findTimer(tname) {
    return await Timer.findOne({
        name: tname
    })
}

async function findAllTimer() {
    return await Timer.find()
}

async function deleteTimer(timerName) {
    if (timerName) {
        // Select specific timer
        t = await findAndDeleteTimer(timerName.toLowerCase())
        if (t === null) return getResponse("timer", "deleteTimerSpecificError", timerName)
        // Stop pinging the DB if no other timers are active
        active = await timersActive()
        if (!active) clearTimer()
        return getResponse("timer", "deleteTimerSpecificSuccess", t.get('name'))
    } else {
        // Delete all timer
        const res = await Timer.deleteMany();
        if (res.deletedCount == 0) return getResponse("timer", "deleteTimerError")
        if (res.deletedCount == 1) res.deletedCount = "einen"
        // Stop Pinging
        clearTimer()
        return getResponse("timer", "deleteTimerSuccess", res.deletedCount)
    }
}

async function getRemainingTime(timerName) {
    // Find the timer and calculate remaining time
    if (timerName) {
        t = await findTimer(timerName.toLowerCase())
        if (t == null) return getResponse("timer", "deleteTimerSpecificError", timerName)
        else {
            return calculateRemainingTime([t])
        }
    } else {
        // Get all timers
        t = await findAllTimer()
        if (t.length < 1) return getResponse("timer", "findTimerError", timerName)
        return calculateRemainingTime(t)
    }
}

function calculateRemainingTime(timer) {
    res = []
    console.log(timer)
    timer.forEach(t => {
        var endTime = t.get('endTime')
        var name = t.get('name') || t.get('duration')
        var remaining = endTime - moment.now()
        res.push({
            "name": name,
            "remaining": remaining
        })
    });
    return res
}

function createTimer(name, endTime, humduration, timeFlag) {
    var temp = new Timer({
        "name": name,
        "endTime": endTime,
        "duration": humduration
    })
    temp.save()
    // If we already have a running timer but the new timer needs a faster ping time, create a new ping and delete old one
    if(globalIntervalID && globalIntervalType == "h" && timeFlag == "m"){
        clearInterval(globalIntervalID)
        pingDB(timeFlag)
    }
    if (!globalIntervalID) pingDB(timeFlag)
    return getResponse("timer", "createTimer", temp.get('duration'))
}

async function checkTimers() {
    //  - Check if Select w. EndTime > Date.now --> Return Timer - Play Sound, Speak Name (Name = Duration if not supplied), Delete from DB
    Timer.findOneAndDelete({
        endTime: {
            $lte: Date.now()
        }
    }, async (err, res) => {
        if (res != null) {
            await playAlarm()
            text = createTTS(res)
            sendWhatsappNotification(text)
            rhasspy.speakText(text)
            // Stop pinging the DB if no other timers are active
            active = await timersActive()
            if (!active) clearTimer()
        }
    })
}

// Stops an interval from running and removes global flags
function clearTimer(){
    clearInterval(globalIntervalID)
    globalIntervalID = undefined
    globalIntervalType = undefined
}



function playAlarm() {
    const file = fs.readFileSync(path.join(__dirname, '../../alarm.wav'))
    return http('http://192.168.0.235:12101/api/play-wav')
        .headers({
            "Content-Type": "audio/wav"
        })
        .post(file)
}

function sendWhatsappNotification(content){
   return http('http://192.168.0.63:8080/api/Notify?msg='+content).get()
}


function createTTS(timer) {
    let name = timer.get('name')
    var text = ""
    if (name) {
        text = getResponse("timer", "timerEnded", name)
    } else {
        text = getResponse("timer", "timerEnded", timer.get('duration'))
    }
    return text
}

function pingDB(timeFlag) {
    // Dynamic interval depending on the "size" of the request, hours, minutes, seconds
    switch (timeFlag) {
        case "m":
            interval = 2000
            break;
        case "s":
            interval = 500
            break;
        default:
            interval = 60000
            break;
    }
    // Check if any timer has been hit
    globalIntervalType = timeFlag
    globalIntervalID = setInterval(() => {
        checkTimers()
    }, interval);
}

// Checks if any timers are still active
async function timersActive() {
    i = await Timer.countDocuments()
    console.log("Timers active: " + i)
    if (i != 0) return true
    else return false
}


module.exports = {
    checkTimers,
    createTimer,
    getRemainingTime,
    deleteTimer
}
