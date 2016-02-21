/*jshint node:true*/
'use strict';


var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
var should = chai.should();
var expect = chai.expect;

var Controller = require("../../controllers/sim-controller");

describe( 'Spark Core Simulation Service', function() {
  var controller;

  before(function(done ) {
    controller = new Controller();
    done();
  });

  after(function( done ) {
    done();
  });

  it( "should emit connect event once connect is invoked", function () {
    var cb = sinon.spy();

    controller.on("connected", cb);
    controller.connect();

    cb.should.have.been.calledOnce;
  });

  it( "should emit sphero connected event", function( done ) {
    this.timeout(6000);

    var connect_cb = sinon.spy();
    var status_cb = sinon.spy();

    setTimeout(function () {
          status_cb.should.have.been.calledWith({"spheros":[{status:"connected"}, {status:"connected"}]});
        }, 1000); //timeout with an error in one second

    setTimeout(function () {
          status_cb.should.have.been.calledTwice;
          done();
        }, 5000); //timeout with an error in one second

    controller.on("connected", connect_cb);
    controller.on("device_status_change", status_cb);
    controller.connect();

    connect_cb.should.have.been.calledOnce;
  });

  it( 'Should not fail when invoking throw event with data', function() {
    controller.rollSphero({});
  });

  it( 'Should start the game with calibrate and end game after 5 rolls', function( ) {
    var end_cb = sinon.spy();

    controller.on("game_ended", end_cb);
    controller.calibrateSphero();
    controller.rollSphero();
    controller.rollSphero();
    controller.rollSphero();
    controller.rollSphero();

    end_cb.should.have.not.been.called;

    controller.rollSphero();

    end_cb.should.have.been.calledOnce;
  });

});
