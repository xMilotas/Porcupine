// Hosts a simple webserver to listen to Rhasspy Intents
// All intents are handled at /api

const express = require('express')
const apiRoutes   = require('./api/')
const bodyParser  = require('body-parser')
const config = require('./config')
global.fetch = require("node-fetch")
const port = 8081

// Initialize app
const app = express();
// Use bodyparser
app.use(bodyParser.json());

// use all routes from /api/..
app.use('/api', apiRoutes)

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

// DB
const mongoose = require('mongoose');


mongoose.connect(config.mongoIP, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB")
});

