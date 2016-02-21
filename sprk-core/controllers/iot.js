"use strict";
/*jshint node:true*/

var util = require("util");
var EventEmitter = require("events").EventEmitter;
// import IoTf
var Client = require("ibmiotf").IotfApplication;

function IOTController() {
    // set authentication info
    var config = {
        "org": "zcy8kq",
        "id": "rspi-one",
        "auth-key": "a-zcy8kq-fdz3hvnm8q",
        "auth-token": "DeeTOFjrOiGGiinD!b"
    };
    this.appClient = new Client(config);

    this.activeSpheros = [];
    // var playerSphero = {};
    // var spheroPlayer = {};

    this.slotSphero = {
        0: "6886E704DC7E",
        1: "6886E7049835"
    };

    this.playerSlot = {};
    this.slotPlayer = {};

    var self = this;

    EventEmitter.call(this);

    // instantiate new listener
    this.connect = function connect() {
        this.appClient.connect();

        this.appClient.on("connect", function () {
            console.log("subscribing to events");
            self.appClient.subscribeToDeviceEvents("raspberry", "rspi-one", "activeSpheros", "json");
            self.appClient.subscribeToDeviceEvents("raspberry", "rspi-one", "gameState", "json");
            self.appClient.subscribeToDeviceEvents("raspberry", "rspi-one", "status", "json");
            self.appClient.subscribeToDeviceStatus();
            self.emit("connected");
        });

        this.appClient.on("deviceStatus", function (deviceType, deviceId, payload, topic) {
          console.log("Device status from :: "+deviceType+" : "+deviceId+" with payload : "+payload);
          payload = JSON.parse(payload);
          if (payload.Action === "Disconnect") {
            console.error("ERROR: RSPI disconnected.");
            var status = {spheros: []};
            for (var i in Object.keys(self.slotSphero)) {
              status.spheros.push({"status": "disconnected"});
            }
            self.emit("device_status_change", status);
          } else if (payload.Action === "Connect") {
            console.log("OK: RSPI connected.");
            // Request status update on the connect
            self.getDeviceStatus();
          }
        });

        this.appClient.on("deviceEvent", function(deviceType, deviceId, eventType, format, payload) {
            if (eventType === "activeSpheros") {
                self.activeSpheros = JSON.parse(payload);
                console.log("Connected spheros: %s", self.activeSpheros);
            } else if (eventType === "gameState") {
                console.log("Got a game state event: \n%s", payload);
                self.emit("gameEnd", JSON.parse(payload));
            } else if (eventType === "status") {
                console.log("Got a status event: \n%s", payload);
                payload = JSON.parse(payload);
                var status = {spheros: []};
                for (var i in Object.keys(self.slotSphero)) {
                  if (payload.spheros[self.slotSphero[i]]) {
                    status.spheros.push({"status": payload.spheros[self.slotSphero[i]]});
                  } else {
                    status.spheros.push({"status": "disconnected"});
                  }
                }

                self.emit("device_status_change", status);
            }
        });
    };

    this.assign = function assign(id) {
        return this.slotSphero[this.playerSlot[id]];
    };

    this.assignSlotToPlayer = function assignSlotToPlayer(player, slot, rgb) {
        this.ejectPlayer(player);
        this.playerSlot[player] = slot;
        this.slotPlayer[slot] = player;

        var payload = {
            params: { "mac": this.slotSphero[this.playerSlot[player]], "rgb": rgb }
        };

        this.appClient.publishDeviceCommand("raspberry", "rspi-one", "pairToSphero", "json", JSON.stringify(payload));
    };

    this.ejectPlayer = function ejectPlayer(player) {
        var slot = this.playerSlot[player];
        if (slot === undefined) {
            return;
        } else {
            delete this.playerSlot[player];
            delete this.slotPlayer[slot];
            return;
        }
    };

    this.rollSphero = function rollSphero(msg) {
        var mac = this.assign(msg.playerID);
        var speed = msg.maxAccel * 4;
        var direction = (msg.direction === 360 ? 0 : msg.direction );
        var rollCmd = {
            "mac": mac,
            "speed": speed,
            "direction": direction,
            "time": 1500
        };
        var cmd = {"params": rollCmd};
        this.appClient.publishDeviceCommand("raspberry", "rspi-one", "roll", "json", JSON.stringify(cmd));
    };

    this.calibrateSphero = function calibrateSphero(msg) {
        var mac = this.assign(msg.playerID);
        var caliCmd = {
            "mac": mac
        };
        var cmd = {"params": caliCmd};
        this.appClient.publishDeviceCommand("raspberry", "rspi-one", "calibrate", "json", JSON.stringify(cmd));
    };

    this.getActiveSpheros = function getActiveSpheros() {
        this.appClient.publishDeviceCommand("raspberry", "rspi-one", "getActiveSpheros", "json", "{}");
    };

    this.getDeviceStatus = function getDeviceStatus() {
      this.appClient.publishDeviceCommand("raspberry", "rspi-one", "getStatus", "json", "{}");
    };
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(IOTController, EventEmitter);

module.exports = IOTController;
