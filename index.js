//includes
var request = require('request');
var assert = require('assert');
var _ = require('underscore');
var express = require('express');
var Wit = require('node-wit').Wit;
var Botkit = require('botkit');


//main
var app = express();

app.get('/', function (req, res) {
  res.send('Hello Digital Innovation team');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
