/*eslint-env node */
/*globals angular */
var myApp = angular.module('myApp', [, 'ngRoute', 'gridster', 'timer', 'ui.bootstrap', 'ui.bootstrap.modal', 'frapontillo.gage', 'pageslide-directive', 'ui.grid', 'ui.grid.selection', 'ngProgress']);

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/dashboard.html',
            controller: ''
        });
});

myApp.controller('timerCtrl', ['$scope', '$interval', 'ngProgressFactory', 'gameService', 'playersService', function ($scope, $interval, ngProgressFactory, gameService, playersService)
    {

        $scope.gameLenghtMillis = 120000;
        $scope.progress = 0;

        $scope.timerRunning = true;
        //Top progress bar

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setColor('#5CB85C'); //green
        $scope.progressbar.setHeight('15px');
$scope.progressbar.start();

        $scope.$watch(function () {
                return $scope.progressbar.status();
            },
            function (newValue, oldValue) {
                if (newValue >= 75 && newValue < 90) {
                    $scope.progressbar.setColor('#F0AD4E'); //orange
                } else if (newValue >= 90) {
                    $scope.progressbar.setColor('#D9534F'); //red
                }
            }
        );

        $interval(function () {
            $scope.progressbar.set((($scope.progressMillis * 100) / $scope.gameLenghtMillis));
        }, 200);


        $scope.$on('GAME-STARTED', function (event, data) {
            gameService.getCurrentGame().then(function (response) {
                $scope.millis = response.data.startDate;
                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
                $scope.progress = 0;
            });
        });


        $scope.$on('GAME-STOP', function (event, data) {
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        });

        $scope.$on('timer-stopped', function (event, data) {
            console.log('Timer Stopped: ' + data);
        });

        $scope.$on('timertick', function (event, args) {
            $scope.progressMillis = args.millis;
        });


                }]);



/*myApp.filter('millisFilter', function () {
    return function (input) {
        input = input % 1000;
        return (input <= 99) ? '0' + input : input;

    }
});*/


myApp.controller('pageslideCtrl', ['$rootScope', '$scope', '$modal', 'couchdbService', 'playersService', 'gameService', function ($rootScope, $scope, $modal, couchdbService, playersService, gameService)
    {


        $scope.getDeviceStatus = function () {
            console.log('go');
            gameService.getDeviceStatus();
        }

        $scope.clicks = 0;
        $scope.clickFooter = function () {
            $scope.clicks++;

            if ($scope.clicks >= 11) {
                $scope.toggle();
            }
        }

        $scope.checked = false; // This will be binded using the ps-open attribute

        $scope.toggle = function () {
            $scope.checked = !$scope.checked;
        }

        $scope.createGame = function () {
            $scope.data = {

            };

            gameService.createGame($scope.data);

            console.log('Game created: ' + $scope.data);
        }

        $scope.start = function () {
            console.log('start function');
            $scope.$broadcast('timer-start');
            $rootScope.$broadcast('timer-start');
            $scope.$emit('timer-start');
            $rootScope.$emit('timer-start');
            $scope.timerRunning = true;
        }

        $scope.startGame = function () {

            $scope.start();

            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;

            $scope.data = {
                startDate: new Date().getTime()
            };

            gameService.startGame($scope.data);

            console.log('Game started: ' + $scope.data);
        }

        $scope.stopGame = function () {

            $scope.data = {
                endDate: new Date().getTime(),
            }

            gameService.stopGame($scope.data);

            console.log('Game stoped: ' + $scope.data);
        }

        $scope.$on('GAME-STOP', function (event, args) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'pages/endModal.html',
                controller: 'endModalCtrl',
                size: 'sm'
            });


        });


}]);


myApp.controller('playersModalCtrl', ['$rootScope', '$scope', '$modalInstance', 'couchdbService', 'playersService', 'userCnt', 'gameService', function ($rootScope, $scope, $modalInstance, couchdbService, playersService, userCnt, gameService)
    {

        $scope.userCount = userCnt + 1;

        $scope.getGenderClass = function (gender) {
            return (gender === 'male') ? 'fa-male' : 'fa-female';
        };

        $scope.gridOptions = {
            enableSorting: true,
            enableColumnMenus: false,
            enableFiltering: true,
            enableVerticalScrollbar: 1,
            enableHorizontalScrollbar: 0,
            rowSelection: true,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            rowHeight: 35,
            lastSelected: '',

            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    console.log(row.entity);
                    playersService.selectNewPlayer(userCnt, row.entity);
                });
            },

            //             <span ng-class="{fa fa-male: row.entity.playerGender == \'male\'}" style="font-size: 10px;"></span>

            columnDefs: [

                {
                    name: 'playerGender',
                    displayName: '',
                    width: 30,
                    enableFiltering: false,
                    cellTemplate: '<div class="ngCellText colt{{$index}}" style="text-align: center;"><span class="fa" ng-class="grid.appScope.getGenderClass(row.entity.playerGender)" style="font-size: 30px; color: rgb({{row.entity.sColor.red}},{{row.entity.sColor.green}},{{row.entity.sColor.blue}});"></span></div>'
                },
                {
                    name: 'playerName',
                    displayName: 'Player',
                    width: '***'
                },
                {
                    name: 'playerAge',
                    displayName: 'Age',
                    width: '*'
                },
                {
                    name: 'registrationDate',
                    displayName: 'Registered',
                    cellFilter: 'date:\'HH:mm:ss MM/dd/yyyy\'',
                    width: '**'
                }
                /*,
                                {
                                    name: 'button',
                                    sortable: false,
                                    displayName: '',
                                    width: 38,
                                    enableFiltering: false,
                                    cellTemplate: '<div class="ngCellText colt{{$index}}" style="text-align: center;">{{row.getProperty(col.field)}}<button class="btn btn-default"><span class="glyphicon glyphicon-remove" style="font-size: 10px;"></span></button></div>'
                                }*/
  ]
        };


        $scope.getPlayers = function () {

            $scope.players = couchdbService.getPlayers().then(function (response) {

                console.log('get PLyers');
                console.log($scope.gridOptions.data = response.data.docs);
                $scope.gridOptions.data = response.data.docs;
            });
        }




        $scope.getPlayers();





        $scope.ok = function () {
            $modalInstance.close('itemObjectThere');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);


myApp.controller('playersCtrl', ['$rootScope', '$scope', '$modal', 'playersService', 'couchdbService', 'mqlWsService', function ($rootScope, $scope, $modal, playersService, couchdbService, mqlWsService)
    {

        $scope.style = function (color) {

            if (color) {

                console.log(color);
                $scope.string = 'background: -webkit-radial-gradient(70% 30%, rgb(' + color.red + ',' + color.green + ',' +
                    color.blue + '), white);background: radial-gradient(70% 30%, rgb(' + color.red + ', ' + color.green + ',' + color.blue + '), white);';

                console.log($scope.string);
                return $scope.string;
            }
        }

        $rootScope.$on('DEVICE-STATUS-CHANGED', function (event, args) {
            console.log('DEVICE-STATUS-CHANGED');
            console.log(args.spheros);

            if (args.spheros[0] === 'connected') {
                console.log('1connected');
            } else if (args.spheros[0] === 'disconnected') {
                console.log('1disconnected');
            }
            if (args.spheros[1] === 'disconnected') {
                console.log('2connected');
            } else if (args.spheros[1] === 'disconnected') {
                console.log('2disconnected');
            }
        });

        /*        $scope.$watchGroup(['player1Calibrated', 'player2Calibrated'], function (newValues, oldValues, scope) {
                    if (newValues[0] && newValues[1]) {
                        var modalInstance = $modal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'pages/startModal.html',
                            controller: 'startModalCtrl',
                            size: 'sm'
                        });
                    }
                });*/

        $scope.player1Calibrated = false;
        $scope.player2Calibrated = false;


        $scope.$on('NEW_PLAYER_SELECTED', function (event, args) {
            console.log('new player');
            console.log(args);

            if (args.slot === 0) {
                $scope.player1 = playersService.getPlayer1();
                $scope.player1Calibrated = false;
            } else if (args.slot === 1) {
                $scope.player2 = playersService.getPlayer2();
                $scope.player2Calibrated = false;
            }

            /*            $scope.$apply(function () {
                            if (args.slot === 0) {
                                $scope.player1 = args.player;
                                playersService.setPlayer1(args.player);
                                $scope.player1Calibrated = false;
                            } else if (args.slot === 1) {
                                $scope.player2 = args.player;
                                playersService.setPlayer2(args.player);

                                $scope.player2Calibrated = false;
                            }
                        });*/
        });

        $scope.$on('PLAYER_CALIBRATION', function (event, args) {
            console.log('player calibration');
            console.log(args);
            console.log($scope.player1._id);

            $scope.$apply(function () {
                if (args.playerID === $scope.player1._id) {
                    $scope.player1Calibrated = true;
                } else if (args.playerID === $scope.player2._id) {
                    $scope.player2Calibrated = true;
                }
            });
        });


}]);



myApp.controller('progressCtrl', ['$scope', 'ngProgressFactory', function ($scope, ngProgressFactory)
    {
        $scope.progressbar = ngProgressFactory.createInstance();
        //        $scope.progressbar.set(50);
        $scope.progressbar.start();
        }]);




myApp.controller('speedo1Ctrl', ['$scope', '$controller', 'playersService', function ($scope, $controller, playersService)
    {

        angular.extend(this, $controller('sprkSpeedoCtrl', {
            $scope: $scope,
            id: 'speedo1'
        }));

        $scope.$on('NEW_PLAYER_SELECTED', function (event, args) {
            if ((args.slot === 0)) {
                $scope.$apply(function () {
                    $scope.playerID = args.player._id;
                });
            }
        });

                 }]);


myApp.controller('speedo2Ctrl', ['$scope', '$controller', 'playersService', function ($scope, $controller, playersService)
    {

        angular.extend(this, $controller('sprkSpeedoCtrl', {
            $scope: $scope,
            id: 'speedo2'
        }));

        $scope.$on('NEW_PLAYER_SELECTED', function (event, args) {
            if ((args.slot === 1)) {
                $scope.$apply(function () {
                    $scope.playerID = args.player._id;
                });
            }
        });
                 }]);


myApp.controller('speedoChart1Ctrl', ['$scope', '$controller', 'playersService', function ($scope, $controller, playersService)
    {

        angular.extend(this, $controller('sprkSpeedoChartCtrl', {
            $scope: $scope,
            id: 'speedoChart1'
        }));

        $scope.$on('NEW_PLAYER_SELECTED', function (event, args) {
            if ((args.slot === 0)) {
                $scope.$apply(function () {
                    $scope.playerID = args.player._id;
                });
            }
        });

                 }]);


myApp.controller('speedoChart2Ctrl', ['$scope', '$controller', 'playersService', function ($scope, $controller, playersService)
    {

        angular.extend(this, $controller('sprkSpeedoChartCtrl', {
            $scope: $scope,
            id: 'speedoChart2'
        }));

        $scope.$on('NEW_PLAYER_SELECTED', function (event, args) {
            if ((args.slot === 1)) {
                $scope.$apply(function () {
                    $scope.playerID = args.player._id;
                });
            }
        });

                 }]);


myApp.controller('dashboardCtrl', ['$scope', function ($scope)
    {

                 }]);

myApp.controller('mainCtrl', ['$rootScope', '$scope', '$modal', 'mqlWsService', 'couchdbService', 'playersService', 'gameService', function ($rootScope, $scope, $modal, mqlWsService, couchdbService, playersService, gameService)
    {

        gameService.getCurrentGame().then(function (response) {

            console.log(response);
            if (response) {
                if (response.data.state === 'running' || response.data.state === 'iddle') {

                    if (response.data.startDate) {
                        $scope.millis = response.data.startDate;
                    }

                    if (response.data.player1) {
                        couchdbService.getPlayerByID(response.data.player1).then(function (response) {
                            console.log(response);
                            console.log('response.data.docs[0]');
                            console.log(response.data);
                            $scope.player1 = response.data.docs[0];
                        });
                    }

                    if (response.data.player2) {
                        couchdbService.getPlayerByID(response.data.player2).then(function (response) {
                            $scope.player2 = response.data.docs[0];

                            console.log('response.data.docs[0]');
                            console.log(response.data.docs[0]);
                        });
                    }

                    console.log('get Current game');
                    console.log(response.data);
                    //            $scope.gridOptions.data = response.data.docs;
                } else if (response.data.state === 'finished') {

                    gameService.createGame();

                }
            }
        });

        mqlWsService.open();




        $scope.openModalSelectPlayer = function (userCnt) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'pages/playersModal.html',
                controller: 'playersModalCtrl',
                size: 'lg',
                resolve: {
                    userCnt: function () {
                        return userCnt;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

                console.log('Modal dismissed at: ' + new Date());
            });
        };

}]);