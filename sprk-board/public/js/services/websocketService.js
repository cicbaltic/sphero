/*eslint-env node */
/*globals myApp Primus*/
myApp.factory('mqlWsService', ['$rootScope', function ($rootScope) {

    // run
    var wsUri = "ws://sprk-ws.mybluemix.net/";
    var topic = 'player';
    var websocket = '';
    var running = false;

    // interface
    var factory = {
        close: close,
        open: open
    };

    // implementation
    function close() {
        websocket.close();
    }

    function open() {

        console.log('ws open');

        if (running === false) {
            var primus = new Primus(wsUri + '?topic=' + topic);
            running = true;

            primus.on('data', function onmsg(data) {

                console.log(data.message);

                if (data.type === 'throw') {
                    console.log('throw ws!');
                    $rootScope.$broadcast('PLAYER_THROW', data.message);
                } else if (data.type === 'calibration') {
                    $rootScope.$broadcast('PLAYER_CALIBRATION', data.message);
                } else if (data.type === 'newPlayerAssigned') {
                    $rootScope.$broadcast('NEW_PLAYER_SELECTED', data.message);
                } else if (data.type === 'gameEnd') {
                    $rootScope.$broadcast('GAME-STOP', data.message);
                } else if (data.type === 'deviceStatusChange') {
                    console.log('deviceStatusChanged ededede service' + JSON.stringify(data.message));

                    $rootScope.$broadcast('DEVICE-STATUS-CHANGED', data.message);
                }
            });
        }
    }

    return factory;

}]);
