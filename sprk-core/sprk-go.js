var mqlight = require('mqlight');
var prompt = require('prompt');

  prompt.start();

var services = {
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

	var credentials = services['mqlight'][0].credentials;
	var mqlightClient = mqlight.createClient(
	{
  		service  : credentials.connectionLookupURI,
  		user     : credentials.username,
  		password : credentials.password
  	});

var topic = 'player';

function calibrate()
{
	   mqlightClient.send(topic, {type:'calibration'}, function (err, data)
  	{
	});
}


function go()
{

  prompt.get(['dir', 'accel'], function (err, result) {

     var playID = "b1caf3af48dde7bdb739f5a326f5f7d6";
    //var playID = "109c71227f18986ac788001a9f5a23dd";

    var message = {"type":"throw","message":{"playerID":playID,"maxAccel":result.accel,"direction":result.dir}};


    mqlightClient.send(topic, message, function (err, data) {
    	if (err) {
            console.log('error');
		} else{
            console.log('send');
        };
        prompt.start();
  	});
  });
}

//while(true) { go() };
	//calibrate();
go();
