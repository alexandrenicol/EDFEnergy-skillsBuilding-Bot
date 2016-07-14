
var Botkit = require('botkit');
var Helper = require('../lib/Helper');
var request = require('request');
const {Wit, log} = require('node-wit');



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

//defining
controller.on('direct_mention,direct_message',function(bot,message) {
  handleRequest(bot, message);
});


/* --------------- wit.ai ----------- */


var handleRequest = function (bot, message) {
  //fetching the request message;
  let messageText = message.text;
  
  //create a WIT client
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
      /**
       * TODO Replace functionName with the name of the function specified in the wit.ai console
       * 
       */
      myFunction({sessionId, context, text, entities}) {
        let promise = new Promise(function(resolve, reject) {
          //TODO
          let name = Helper.firstEntityValue(entities, 'name');
          // 1. fetch the entities value --> use Helper.firstEntityValue(entities, 'entityName')
          // 2. check the entity has been defined
          if (name) {
            context.success = true;
            context.name = 'Your new name';
            context.surname = 'Nicol';
          }
          // 3. if so, add the value 'true' to the 'success' key of 'context'
          // 4. add some logic - fetch value from API - alter context variable
          resolve(context);
        });
        return promise;
      
      },
      weather({sessionId, context, text, entities}) {
        let promise = new Promise(function(resolve, reject) {
          //TODO
          let location = Helper.firstEntityValue(entities, 'location');
          // 1. fetch the entities value --> use Helper.firstEntityValue(entities, 'entityName')
          // 2. check the entity has been defined
          
          if (location) {
            context.success = true;
            context.location = location;
          }
          // 3. if so, add the value 'true' to the 'success' key of 'context'
          // 4. add some logic - fetch value from API - alter context variable
          resolve(context);
        });
        return promise;
      
      }
    }
  });
  
  var uuid = 42;
  client.runActions(uuid, messageText, {})
  .then(function(data) {
    console.log(data);
    if (data.success){
      //replying
      bot.reply(message, client.witResponse);
    } else {
      //replying
      bot.reply(message, 'oops');
    }
    
  });
  
  
}


