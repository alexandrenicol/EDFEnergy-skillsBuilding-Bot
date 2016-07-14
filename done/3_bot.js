var Botkit = require('botkit');
var Helper = require('../lib/Helper');
var request = require('request');
const {Wit, log} = require('node-wit');

const Lang = require('../lib/Lang');

/* ------------ slack bot -------------*/

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


/* --------------- wit.ai ----------- */


var handleRequest = function (bot, message) {
  //fetching the request message;
  let messageText = message.text;
  
  const client = new Wit({
    accessToken: Helper.witServerToken(),
    actions: {
      send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        client.witResponse = text;
        return new Promise(function(resolve, reject) {
          console.log('sending...', JSON.stringify(response));
          return resolve();
        });
      },
      translate({sessionId, context, text, entities}) {
        return new Promise(function(resolve, reject) {
          console.log(context);
          console.log(entities);
          
          //get entities
          var phrase_to_translate = Helper.firstEntityValue(entities, 'phrase_to_translate');
          var language = Helper.firstEntityValue(entities, 'language');
          
          //check entities
          if (phrase_to_translate && language ) {
            console.log('test', language);
            
            //request options
            let options = {
              url: 'https://glosbe.com/gapi/translate?from=en&dest='+Lang.getCode(language)+'&format=json&phrase='+phrase_to_translate,
              method: 'GET'
            }
            
            console.log(options.url);
            
            //call request
            request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                // fetch the response
                body = JSON.parse(body);
                console.log(body);
                //update context
                context.success = true;
                try {
                  context.translation = body.tuc[0].phrase.text;
                } catch(err) {
                  context.translation = "failed";
                }
                
                
                //resolve the promise
                return resolve(context);
              }else{
                return resolve(context);
              }
            });
          }
        });
      }
    }
  });

  client.runActions(42, messageText, {})
  .then(function(data) {
    console.log(data);
    if (data.success){
      //replying with bot response
      bot.reply(message, client.witResponse);
    } else {
      //replying, not success case
      bot.reply(message, 'oops');
    }
    
  });
  
  
}
