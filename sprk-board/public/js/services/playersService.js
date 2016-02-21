myApp.service('playersService', ['$rootScope', '$http', function ($rootScope, $http) {

    var player1;
    var player2;

    var selectNewPlayer = function (slot, player) {

        if (slot === 0) {
            player1 = player;
        } else if (slot === 1) {
            player2 = player;
        }

        var data = {
            slot: slot,
            player: player
        };

        var req = {
            method: 'POST',
            url: '/update/player/selected',
            data: data
        };

        return $http(req).then(function (response) {
            console.log(response);
        });
    }

    var getPlayer1 = function () {
        return player1;
    }

    var getPlayer2 = function () {
        return player2;
    }
    var setPlayer1 = function (newObj) {
        player1 = newObj;
    }
    var setPlayer2 = function (newObj) {
        player2 = newObj;
    }

    return {
        selectNewPlayer: selectNewPlayer,
        getPlayer1: getPlayer1,
        getPlayer2: getPlayer2
    };

}]);