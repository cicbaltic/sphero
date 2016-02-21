"use strict";
/*jshint node:true*/

var util = require("util");
var EventEmitter = require("events").EventEmitter;
var log = require("bunyan").createLogger({name: "SimulationController"});

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function SimulationController() {

    var self = this;

    this.gameStarted = false;
    this.rollCount = 0;

    EventEmitter.call(this);

    // instantiate new listener
    this.connect = function connect() {
        //Simulate the random client behaviour
        self.emit("connected");
        self.emit("device_status_change", {"spheros":[{status:"connected"}, {status:"connected"}]});

        setInterval(function () {
          var status = {"spheros":[{status:randomInt(0, 100) < 80 ? "connected":"disconnected"},
                               {status:randomInt(0, 100) < 80 ? "connected":"disconnected"}]}

          self.emit("device_status_change", status);
        }, 5000);
    };

    this.assign = function assign(id) {
        return this.slotSphero[this.playerSlot[id]];
    };

    this.assignSlotToPlayer = function assignSlotToPlayer(player, slot, rgb) {
      log.info({"player":player, "slot": slot, "rgb": rgb}, 'Requested the assignSlotToPlayer function.');
    };

    this.ejectPlayer = function ejectPlayer(player) {
      log.info({"player": player},'Requested the ejectPlayer function.');
    };

    this.rollSphero = function rollSphero(msg) {
      if (this.gameStarted) {
        this.rollCount++;

        if (this.rollCount >= 5) {
          self.emit("game_ended",
                    {"type":   "gameEnd",
                     "message": {
                        "slot": randomInt(0, 1),
                        "timeStamp": new Date().getTime()
                    }});

          this.gameStarted = false;
          this.rollCount = 0;
        }
      }

      log.info({msg:msg},'Requested the rollSphero function.');
    };

    this.calibrateSphero = function calibrateSphero(msg) {
      this.gameStarted = true;

      log.info('Requested the calibrateSphero function.');
    };

    this.getActiveSpheros = function getActiveSpheros() {
      log.info('Requested the getActiveSpheros function.');
    };

    this.getDeviceStatus = function getDeviceStatus() {
      log.info('Requested the getDeviceStatus function.');
    }
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(SimulationController, EventEmitter);

module.exports = SimulationController;
