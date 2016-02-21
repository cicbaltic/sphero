/*eslint-env node */
'use strict';
(function () {

    var Cloudant = require('cloudant');

    //var services = JSON.parse(process.env.VCAP_SERVICES);

    var services = {
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
        ]
    };

    var cloudant = Cloudant(services.cloudantNoSQLDB[0].credentials.url);

    function insertPlayer(data, callback) {

        data.registrationDate = new Date().getTime();

        cloudant.db.use('sprk-players').insert(data, function (err, body, header) {
            if (err) {
                return console.log('[insertplayer error:] ', err.message);
            }
            callback(body);
        });
    }


    function getCurrentGame(callback) {

        var query = {
            "selector": {
                "creationDate": {
                    "$gt": 0
                }

            },
            "fields": [
    "_id",
    "_rev",
      "player1",
      "player2",
      "creationDate",
                "startDate",
                "state"
  ],
            "sort": [
                {
                    "creationDate": "desc"
    }
  ],
            "limit": 1
        };

        cloudant.db.use('sprk-games').find(query, function (err, body, header) {
            if (err) {
                return console.log('[cloudantDB: getCurrentGame ERROR:] ', err.message);
            }
            callback(body.docs[0]);
        });
    }


    function getPlayerByID(_id, callback) {

        var qeury = {
            "selector": {
                '_id': _id
            },
            //            "fields": ["_id", "_rev", "playerName", "playerAge", "playerGender", "sColor"]
        };

        cloudant.db.use('sprk-players').find(qeury, function (err, body, header) {
            if (err) {
                return console.log('[getplayer error:] ', err.message);
            }
            console.log(body)
            callback(body);
        });
    }





    //returns (confirmed) players from queue in asc order by insertDate
    function getPlayers(callback) //confirmed = true/false
    {

        var qeury = {
            "selector": {
                "_id": {
                    "$gt": 0
                }
            },
            "fields": [
    "_id",
    "_rev",
     "playerName",
                "playerAge",
                "playerGender",
                "playerID",
                "insertDate",
                "sColor",
                "registrationDate"
  ],
            "sort": [
                {
                    "_id": "asc"
    }
  ]
        };

        cloudant.db.use('sprk-players').find(qeury, function (err, body, header) {
            if (err) {
                return console.log('[getplayerqueue error:] ', err.message);
            }
            callback(body);
        });
    }



    function insertThrow(data) {
        cloudant.db.use('sprk-throws').insert(data, function (err, body, header) {
            if (err) {
                return console.log('[insertthrow error:] ', err.message);
            }
        });
    }

    module.exports = {

        getPlayers: getPlayers,

        insertPlayer: insertPlayer,
        insertThrow: insertThrow,
        getPlayerByID: getPlayerByID,
        getCurrentGame: getCurrentGame
    };

}());
