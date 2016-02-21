/*eslint-env node */
/*globals myApp */
myApp.factory('gameService', ['$rootScope', '$http', function ($rootScope, $http) {

    // interface
    var factory = {
        createGame: createGame,
        startGame: startGame,
        stopGame: stopGame,
        restartGame: restartGame,
        getCurrentGame: getCurrentGame,
        getDeviceStatus: getDeviceStatus
    };


    function getDeviceStatus() {
        var req = {
            method: 'GET',
            url: 'get/deviceStatus',
            //            data: data
        };
        return $http(req);
    }


    // implementation
    function createGame(data) {
        var req = {
            method: 'POST',
            url: 'game/create',
            data: data
        };
        return $http(req);
    }

    // implementation
    function startGame(data) {
        var req = {
            method: 'POST',
            url: 'game/start',
            data: data
        };

        return $http(req).then(function (response) {
            $rootScope.$broadcast('GAME-STARTED', {
                startDate: response
            });
        });;
    }

    function stopGame(data) {
        var req = {
            method: 'POST',
            url: 'game/end',
            data: data
        };

        $rootScope.$broadcast('GAME-STOPED', data.message);

        return $http(req);
    }

    function restartGame(data) {
        var req = {
            method: 'POST',
            url: 'game/restart',
            data: data
        };
        return $http(req);
    }

    function getCurrentGame() {

        var req = {
            method: 'GET',
            url: '/get/currentGame',
            //            data: data
        };
        return $http(req);
    }

    return factory;
}]);