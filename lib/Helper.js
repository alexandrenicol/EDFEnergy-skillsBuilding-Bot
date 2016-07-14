var bodyParser = require('body-parser');
var express = require('express');

class Helper {
  
  static witServerToken () {
    return ''; //TODO change with your own
  } 
  
  static slackToken () {
    return ''; //TODO change with your own
  } 
  
  static init () {
    var app = express();
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    return app;

  }
  
  
  
  static firstEntityValue (entities, entity) {
    const val = entities && entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value
    ;
    if (!val) {
      return null;
    }
    return typeof val === 'object' ? val.value : val;
  }
}

module.exports = Helper;
