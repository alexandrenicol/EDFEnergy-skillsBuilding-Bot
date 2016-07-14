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


var handleRequest = function (bot, message) {
  //fetching the request message;
  let messageText = message.text;
  
  try {
    messageList = messageText.split(" to ");
    dest = messageList[1];
    messageList = messageList[0].split(" from ");
    origin = messageList[1];
    dest = dest.trim();
    origin = origin.trim();
    
    //request options
    let options = {
      url: 'https://huxley.apphb.com/next/'+origin+'/to/'+dest+'?accessToken=DA1C7740-9DA0-11E4-80E6-A920340000B1',
      method: 'GET'
    }
    console.log(options.url);
    
    //call request
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // fetch the response
        body = JSON.parse(body);
        console.log(body);
        

        //resolve the promise
        bot.reply(message, body.departures[0].service.std);
      }else{
        bot.reply(message, 'Nope.');
      }
    });
  } catch (err) {
    bot.reply(message, 'Nope.');
  }
}
