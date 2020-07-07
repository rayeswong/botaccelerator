var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer')
var helper = require("./app/helper.js");
var logger = helper.getLogger();

//var index = require('./index');
var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, 'uploads/')
    var SETTINGS = require('./utils/config.js');
    cb(null, SETTINGS.OUTPUT.PATH)
  },
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now();
    cb(null, uniquePreffix + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  console.log(req.file.path);
  var botgenerator = require('./botgenerator');
  var options = {
    file: req.file.path,
    filename: req.file.filename,
    name: req.body.name,
    prefix: req.file.filename.substring(0, req.file.filename.indexOf("-") + 1), 
    version: req.body.version,
    translate: (req.body.translate!=null && req.body.translate.toUpperCase() == 'TRUE')
  }
  var result = botgenerator.generateBot(options);
  var response = { status: "success", result: result };
  console.log("response = " + response);
  res.type('application/json');
  res.status(200).send(JSON.stringify(response));
})

module.exports = app;
