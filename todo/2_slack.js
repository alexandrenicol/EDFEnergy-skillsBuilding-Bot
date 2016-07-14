//https://github.com/howdyai/botkit/blob/master/readme-slack.md

var Botkit = require('botkit');
var Helper = require('../lib/Helper');
var request = require('request');

//create our Bot
var controller = Botkit.slackbot({
    debug: false
});

//connect our bot to slack
var bot = controller.spawn({
    token: Helper.slackToken()
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});


//TODO defining activities events (string)
// choose between (you can choose multiple, use coma between two)
// - direct_message
// - direct_mention
// - mention
// - ambient
// + Slack API native event https://api.slack.com/events

const events = '';

//defining our bot capabilities
controller.on(events, function(bot,message) {
  //TODO
  // - fetch the message
  // - add some logic
  // - replying (use the bot.reply method)

});

