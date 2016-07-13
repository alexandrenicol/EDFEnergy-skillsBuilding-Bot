//includes
const request = require('request');
const {Wit, log} = require('node-wit');
const Helper = require('../lib/Helper');

//initiliase the server;
var app = Helper.init();

//wit.ai class
const client = new Wit({
  accessToken: Helper.witServerToken(),
  actions: {
    /**
     * send
     * a method required by wit.ai
     * this method will contain the the request sent to wit.ai response given 
     */
    send(request, response) {
      const {sessionId, context, entities} = request;
      const {text, quickreplies} = response;
      //Saving the response in our global variable
      client.witResponse = text;
      return new Promise(function(resolve, reject) {
        console.log('sending...', JSON.stringify(response));
        return resolve();
      });
    },
    /**
     * //TODO Replace functionName with the name of the function specified in the wit.ai console
     * 
     */
    functionName({sessionId, context, text, entities}) {
      let promise = new Promise(function(resolve, reject) {
        //TODO
        // 1. fetch the entities value --> use Helper.firstEntityValue(entities, 'entityName')
        // 2. check the entity has been defined
        // 3. if so, add the value 'true' to the 'success' key of 'context'
        // 4. add some logic - fetch value from API - alter context variable
        resolve(context);
      });
      return promise;
    }
  }
});

//routing
app.post('/wit', function (req, res) {
  //fetch message from the POST paramater
  const message = req.body.message;
  
  //check if message is defined
  if(!message) {
    res.send('please defines the "message" POST parameter');
    return;
  }
  console.log('POST message: ', message);
  
  //load the response from wit.ai
  //TODO 
  // - use the client.runActions method - doc https://github.com/wit-ai/node-wit
  // - check the context was successfull
  // - use res.send(yourResponse) in the 
  var uuid = 42;
  
  client.runActions(uuid, message, {})
  .then(function(data) {
    //todo
    
  });
  
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
