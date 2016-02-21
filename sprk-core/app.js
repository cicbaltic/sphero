'use strict';
/*jshint node:true*/

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var mqlight = require('mqlight');

var services;

if (process.env.VCAP_SERVICES) {
    services = JSON.parse(process.env.VCAP_SERVICES);
} else {
    services = {
        "mqlight": [
            {
                "name": "MQ Light-dev",
                "label": "mqlight",
                "plan": "standard",
                "credentials": {
                    "nonTLSConnectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd",
                    "username": "rFGVkvCapg8k",
                    "connectionLookupURI": "http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=0b891d20-23ed-4575-ba0a-b2d196103ecd&tls=true",
                    "password": ";rE&KcxVVA:N",
                    "version": "2"
                }
            }
        ],
        "iotf-service": [
            {
                "name": "Internet of Things Foundation-u0",
                "label": "iotf-service",
                "plan": "iotf-service-free",
                "credentials": {
                    "iotCredentialsIdentifier": "a2g6k39sl6r5",
                    "mqtt_host": "zcy8kq.messaging.internetofthings.ibmcloud.com",
                    "mqtt_u_port": 1883,
                    "mqtt_s_port": 8883,
                    "base_uri": "https://zcy8kq.internetofthings.ibmcloud.com:443/api/v0001",
                    "http_host": "zcy8kq.internetofthings.ibmcloud.com",
                    "org": "zcy8kq",
                    "apiKey": "a-zcy8kq-3dxyzxfq2h",
                    "apiToken": "3(e&OpoiCajaYPSJ2H"
                }
            }
        ]
    };
}

var iotService = appEnv.getServiceCreds(/Internet Of Things.*/) || services["iotf-service"][0].credentials;
var mqLightService = appEnv.getServiceCreds(/MQ Light.*/) || services.mqlight[0].credentials;

if (!mqLightService) {
    throw "ERROR: MQLight service is not bound to the application.";
}

if (!iotService) {
    throw "ERROR: IOT service is not bound to the application.";
}

// import iot
var IOTController = require('./controllers/iot');
var iotController = new IOTController({
    "org": "zcy8kq",
    "id": "rspi-one",
    "auth-key": "a-zcy8kq-fdz3hvnm8q",
    "auth-token": "DeeTOFjrOiGGiinD!b"
});

var SimController = require('./controllers/sim-controller');
var simController = new SimController();

if (services.mqlight === null) {
    throw 'Error - Check that app is bound to service';
}

//default to IOT controller
var controller = iotController;

controller.on("connected", function () {
    console.log("calling for active spheros");
    controller.getActiveSpheros();
    controller.getDeviceStatus();
});

controller.on("gameEnd", function (payload) {
    console.log("Sending GameEnd event: " + payload.message);
    mqlightClient.send("player", {
        type: "gameEnd",
        message: payload.message
    });
});

controller.on("device_status_change", function (status) {
    console.log("Device status changed: " + JSON.stringify(status));
    mqlightClient.send("player", {
        type: "deviceStatusChange",
        message: status
    });
});

controller.connect();

var topicPattern = 'player';

var mqlightClient = mqlight.createClient({
    service: mqLightService.connectionLookupURI,
    user: mqLightService.username,
    password: mqLightService.password
});

mqlightClient.on('started', function () {

    mqlightClient.subscribe(topicPattern);

    mqlightClient.on('message', function (data, delivery) {
        console.log("data: ");
        console.log(JSON.stringify(data));
        var type = data.type;
        var message = data.message;

        if (type == "throw") {
            controller.rollSphero(message);
        } else if (type == "calibration") {
            controller.calibrateSphero(message);
        } else if (type == "newPlayerAssigned") {
            controller.assignSlotToPlayer(message.player._id, message.slot, message.player.sColor);
        } else if (type == "deviceStatusRequest") {
            controller.getDeviceStatus();
        }
        else {
            console.log("some other message");
        }
    });
});

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
