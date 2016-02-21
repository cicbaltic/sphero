    /*globals myApp gameService*/
/*eslint-env node */
myApp.controller('startModalCtrl', ['$rootScope', '$scope', '$modalInstance', '$interval', 'couchdbService', 'playersService', 'gameService', function ($rootScope, $scope, $modalInstance, $interval, couchdbService, playersService,gameService)
        {
        	
        	                         $scope.$on('GAME-START', function (event, args) {
                                    
               $modalInstance.close(); 
        });
        
          	                         $rootScope.$on('GAME-START', function (event, args) {
                                    
               $modalInstance.close(); 
        });
        	
        	
            $scope.startGame = function () {

                $modalInstance.close();

                $rootScope.$broadcast('GAME-START');
                

                $scope.data = {
                    startDate: new Date().getTime(),
                    player1: playersService.getPlayer1()._id,
                    player2: playersService.getPlayer2()._id
                };

                gameService.startGame($scope.data);

                console.log('Game Started: ' + $scope.data);
            };
    }]);
    
    myApp.controller('endModalCtrl', ['$rootScope', '$scope', '$window','$modalInstance', '$interval', 'couchdbService', 'playersService', 'gameService', function ($rootScope, $scope, $window, $modalInstance, $interval, couchdbService, playersService,gameService)
        {
        	
            $scope.restartGame = function () {

       $window.location.reload();
       
            };
    }]);