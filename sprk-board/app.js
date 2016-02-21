/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
/*globals callback */
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var Cloudant = require('cloudant');
var bodyParser = require('body-parser');

//Local deps
var cloudantDB = require('./modules/cloudantDB');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var mqlight = require('mqlight');

// start server on the specified port and binding host
app.listen(appEnv.port, function () {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});


var services; // = JSON.parse(process.env.VCAP_SERVICES);
if (process.env.VCAP_SERVICES) {
    console.log("I'm on Bluemix");
    services = JSON.parse(process.env.VCAP_SERVICES);
} else {
    services = {
        "cloudantNoSQLDB": [
            {
                "name": "Cloudant NoSQL DB-dev",
                "label": "cloudantNoSQLDB",
                "plan": "Shared",
                "credentials": {
                    "username": "8282548a-1402-49bf-9119-8d7c3c3f5c15-bluemix",
                    "password": "6acad6060404c725b331ab6c654bdc5b3b92efd6bb7c7a9fa6865119869167a7",
                    "host": "8282548a-1402-49bf-9119-8d7c3c3f5c15-bluemix.cloudant.com",
                    "port": 443,
                    "url": "https://8282548a-1402-49bf-9119-8d7c3c3f5c15-bluemix:6acad6060404c725b331ab6c654bdc5b3b92efd6bb7c7a9fa6865119869167a7@8282548a-1402-49bf-9119-8d7c3c3f5c15-bluemix.cloudant.com"
                }
            }
        ],
        "mqlight": [
            {
                "name": "MQ Light-dev",
                "label": "mqlight",
                "plan": "standard",
                "credentials": {
                    "password": "&(2-wDBCc]?_",
                    "nonTLSConnectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd",
                    "version": "2",
                    "connectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd&tls=true",
                    "username": "4eRNScBazpeE"
                }
            }
        ]
    };
}


var cloudant = Cloudant(services.cloudantNoSQLDB[0].credentials.url);

if (services['mqlight'] != null) {

    var mqlightClient = mqlight.createClient({
        service: services['mqlight'][0].credentials.connectionLookupURI,
        user: services['mqlight'][0].credentials.username,
        password: services['mqlight'][0].credentials.password
    });
}

var mqlightClientPlayer = mqlightClient;

mqlightClientPlayer.on('started', function () {

    mqlightClientPlayer.subscribe('player');
    mqlightClientPlayer.on('message', function (data, delivery) {

        console.log('Got message from player topic: %s', JSON.stringify(data));

        if (data.type === 'registration') {

            cloudantDB.insertPlayer(data.message, function (body) {
                body.tempID = data.message.tempID;
                var message = {
                    type: "registered",
                    message: body
                };

                mqlightClientPlayer.send('player', message);
            });
        } else if (data.type === 'registration') {

            cloudantDB.insertPlayer(data.message, function (body) {
                body.tempID = data.message.tempID;
                var message = {
                    type: "registered",
                    message: body
                };

                mqlightClientPlayer.send('player', message);
            });
        } else if (data.type === 'gameEnd') {

            /*       var query = {
           "selector": {
               "startDate": {
                   "$gt": 0
               }

           },
           "fields": [
    "_id",
    "_rev",
      "player1",
      "player2",
      "startDate"
  ],
           "sort": [
               {
                   "startDate": "asc"
    }
  ]
       };

       cloudant.db.use('sprk-games').find(query, function (err, body, header) {
           if (err) {
               return console.log('[findcurrentgame error:] ', err.message);
           }
           body.docs[0].endDate = data.message.timeStamp;
           body.docs[0].winner = data.message.slot;

           mqlightClientPlayer.send('player', {
               type: "gameFinished",
               message: body.docs[0]
           });

           console.log({
               type: "gameFinished",
               message: body.docs[0]
           });


           cloudant.db.use('sprk-games').insert(body.docs[0], function (err, body, header) {
               if (err) {
                   return console.log('[updategameend error:] ', err.message);
               }

           });
       });*/

        } else if (data.type === 'throw') {
            cloudantDB.insertThrow(data.message, function (body) {
                console.log(body);
            });

        } else if (data.type === 'gameInfoRequest') {

            cloudantDB.getCurrentGame(function (body) {

                var message = {
                    type: "gameStatusChanged",
                    message: body
                };

                mqlightClientPlayer.send('player', message);

            });

        }






    });
});

app.post('/game/create', function (req, res) {

    var message = {
        type: "gameStatusChanged",
        message: req.body
    };

    message.message.state = "iddle";
    message.message.creationDate = new Date().getTime();


    mqlightClientPlayer.send('player', message);

    console.log(req.body);
    cloudant.db.use('sprk-games').insert(req.body, function (err, body, header) {
        if (err) {
            return console.log('[creategame ERROR:] ', err.message);
        }
        res.send(body);
    });

});

app.post('/game/start', function (req, res) {

    cloudantDB.getCurrentGame(function (body) {

        body.startDate = req.body.startDate;
        body.state = "running";

        var message = {
            type: "gameStatusChanged",
            message: body
        };

        mqlightClientPlayer.send('player', message);

        cloudant.db.use('sprk-games').insert(body, function (err, body, header) {
            if (err) {
                return console.log('[creategame ERROR:] ', err.message);
            }
            res.send(body);
        });

    });
});
app.post('/game/end', function (req, res) {

    cloudantDB.getCurrentGame(function (body) {

        body.endDate = req.body.endDate;
        body.state = "finished";

        var message = {
            type: "gameStatusChanged",
            message: body
        };

        mqlightClientPlayer.send('player', message);

        cloudant.db.use('sprk-games').insert(body, function (err, body, header) {
            if (err) {
                return console.log('[endgame ERROR:] ', err.message);
            }
            res.send(body);
        });

    });
});

/*app.post('/game/restart', function (req, res) {

    cloudantDB.getCurrentGame(function (body) {

        body.state = "iddle";

        var message = {
            type: "gameRestart",
            message: body
        };

        mqlightClientPlayer.send('player', message);

        cloudant.db.use('sprk-games').insert(body, function (err, body, header) {
            if (err) {
                return console.log('[creategame ERROR:] ', err.message);
            }
            res.send(body);
        });

    });
});*/


app.post('/update/player/selected', function (req, res) {

    cloudantDB.getCurrentGame(function (body) {
        console.log(req.body);

        if (req.body.slot === 0) {
            body.player1 = req.body.player._id;
        } else if (req.body.slot === 1) {
            body.player2 = req.body.player._id;
        }

        cloudant.db.use('sprk-games').insert(body, function (err, body, header) {
            if (err) {
                return console.log('[creategame ERROR:] ', err.message);
            }

            console.log(body);

            var message = {
                type: "newPlayerAssigned",
                message: req.body
            };

            mqlightClientPlayer.send('player', message);

            res.send(body);
        });
    });
});


app.get('/get/currentGame', function (req, res) {

    var playerdb = cloudant.db.use('sprk-players');

    cloudantDB.getCurrentGame(function (body) {

        console.log(body);

        res.send(body);
    });

});



app.get('/get/deviceStatus', function (req, res) {

    var message = {
        type: "deviceStatusRequest",
        message: ""
    };

    mqlightClientPlayer.send('player', message);

});


app.get('/get/player/:uid', function (req, res) {

    var playerdb = cloudant.db.use('sprk-players');

    playerdb.find({
        selector: {
            _id: req.params.uid
        }
    }, function (er, result) {
        if (er) {
            throw er;
        }
        res.send(result);
    });
});


app.get('/get/players', function (req, res) {

    cloudantDB.getPlayers(function (body) {

        console.log(body);

        res.send(body);
    });

});
