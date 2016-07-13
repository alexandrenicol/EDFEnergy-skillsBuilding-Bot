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


//defining our bot capabilities
controller.on('direct_mention,direct_message',function(bot,message) {
  handleRequest(bot, message);
});

controller.on('user_typing',function(bot,message) {
  bot.reply(message, 'A user is typing ');
});



var handleRequest = function (bot, message) {
  //fetching the request message;
  let messageText = message.text;
  
  //replying
  bot.reply(message, 'You said '+messageText);
}
