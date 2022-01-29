const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    name: String,
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    duration: String
  });

const Timer = mongoose.model('Timer', timerSchema)


module.exports = Timer