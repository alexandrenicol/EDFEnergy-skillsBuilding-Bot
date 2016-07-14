//includes
const request = require('request');
const {Wit, log} = require('node-wit');
const Helper = require('../lib/Helper');

//init
var app = Helper.init();


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
    define({sessionId, context, text, entities}) {
      return new Promise(function(resolve, reject) {
        var name = Helper.firstEntityValue(entities, 'name')
        if (name) {
          context.success = true;
        }
        resolve(context);
      });
    },
    energy({sessionId, context, text, entities}) {
      return new Promise(function(resolve, reject) {
        var energy = Helper.firstEntityValue(entities, 'energy')
        var energyType = Helper.firstEntityValue(entities, 'energyType')
        console.log('energy', energy, energyType);
        if (energyType && energy) {
          context.success = true;
          context.value = '£1.30'; // we should call a weather API here
          context.energyType = energyType;
          context.energy = energy;
        } 
        return resolve(context);
      });
    }
  }
});


//routing
app.post('/wit', function (req, res) {
  const message = req.body.message;
  
  if(!message) {
    res.send('please defines the "message" POST parameter');
    return;
  }
  console.log('POST message: ', message);
  
  client.runActions(42, message, {})
  .then(function(data) {
    console.log(data);
    if (data.success){
      res.send(client.witResponse);
    } else {
      res.send('failed');
    }
    
  });
  
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
