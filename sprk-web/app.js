/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var bodyParser = require('body-parser');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
//app.listen(3001, function()
//app.listen(appEnv.port, function()
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index');
});

var mqlight = require('mqlight');

var services;

if (process.env.VCAP_SERVICES)
{
	services = JSON.parse(process.env.VCAP_SERVICES);
}
else
{
  console.log("running locally");
  /*
  services = {
   "mqlight": [
      {
         "name": "MQ Light-vu",
         "label": "mqlight",
         "plan": "standard",
         "credentials": {
            "nonTLSConnectionLookupURI": "http://mqlightprod-lookup.eu-gb.bluemix.net/Lookup?serviceId=ce9e8c1d-17d8-4942-a308-785192b1ade2",
            "username": "kTahgJTxfa9c",
            "connectionLookupURI": "http://mqlightprod-lookup.eu-gb.bluemix.net/Lookup?serviceId=ce9e8c1d-17d8-4942-a308-785192b1ade2&tls=true",
            "password": "2mMwA[_ewE%X",
            "version": "2"
         }
      }
    ]
  };
  */
  services = {
    "mqlight": [
      {
         "name": "MQ Light-dev",
         "label": "mqlight",
         "plan": "standard",
         "credentials": {
            "nonTLSConnectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd",
            "username": "zKV9H74Xx8ur",
            "connectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd&tls=true",
            "password": "7nJ/QaZbY=q,",
            "version": "2"
         }
      }
    ]
  };
}

if (services['mqlight'] == null)
{
  throw 'Error - Check that app is bound to service';
}

var credentials = services['mqlight'][0].credentials;
var mqlightClient = mqlight.createClient(
{
	service  : credentials.connectionLookupURI,
  user     : credentials.username,
  password : credentials.password
});

var topic = 'public';

app.use(bodyParser.json());
app.post('/msg', function (req, res)
  {
	  console.log("got it: " + mqlightClient.state);

	  var message = req.body;

	  console.log(message);
	  topic = message["topic"];
	  delete message.topic;

  	console.log("started");
  	mqlightClient.send(topic, message, function (err, data)
  	  {
    	  console.log('Sent: %s', JSON.stringify(message));
     	});

    res.send(JSON.stringify(message));
});
