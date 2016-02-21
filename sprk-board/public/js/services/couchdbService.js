myApp.factory('couchdbService', ['$http', function ($http) {

    // interface
    var factory = {
        insertPlayer: insertPlayer,
        getPlayers: getPlayers,
        //        getPlayer : getPlayer,
        confirmPlayer: confirmPlayer,
        getQueuePlayer: getQueuePlayer,
        getPlayerByID: getPlayerByID,
        //        getQueuePlayers : getQueuePlayers,
        getQueuePlayerInfo: getQueuePlayerInfo,


        getPlayers: getPlayers
    };

    // implementation
    function insertPlayer(data) {
        var req = {
            method: 'POST',
            url: 'insert/player',
            data: data
        };
        return $http(req);
    }

    function getPlayers() {

        console.log('db service get players');

        var data = {
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
    "playerGendre"
  ],
            "sort": [
                {
                    "_id": "asc"
    }
  ]
        };

        /*  var data = {
              "type": "text",
              "index": {}
          };*/

        var req = {
            method: 'GET',
            url: 'get/players',
            //            params: data
        };
        return $http(req);
    }


    function getQueuePlayer() {

        console.log('db service get playeR');

        var req = {
            method: 'GET',
            url: '/get/queue/player',
            //            params: data
        };
        return $http(req);
    }


    function getPlayerByID(id) {

        console.log('db service get playeR');

        var req = {
            method: 'GET',
            url: '/get/player/' + id,
            //            params: id
        };
        return $http(req);
    }

    function getPlayers() {

        console.log('db service get playeR');

        var req = {
            method: 'GET',
            url: '/get/players/',
            //            params: id
        };
        return $http(req);
    }

    function getQueuePlayerInfo(id) {

        console.log('db player queue info');

        var req = {
            method: 'GET',
            url: '/get/queue/player/info/' + id,
            //            params: id
        };
        return $http(req);
    }

    function confirmPlayer(id) {

        console.log('db service get playeR');

        var req = {
            method: 'POST',
            url: '/insert/queue/player/confirm',
            data: id
        };
        return $http(req);
    }









    return factory;
}]);