myApp.directive('sprkSpeedo', function() {
 /* var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&callback=JSON_CALLBACK&q=";*/
  return {
    restrict: 'EA',
   /* require: '^ngCity',*/
    scope: {
      sprkPlayer: '@'
    },
    templateUrl: 'pages/sprk-speedo.html',
    controller: 'sprkSpeedoCtrl',
      
      
      
    link: function(scope, iElement, iAttrs, ctrl) {
/*      scope.getTemp(iAttrs.ngCity);
      scope.$watch('weather', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {
          var highs = [],
              width   = 200,
              height  = 80;

          angular.forEach(scope.weather, function(value){
            highs.push(value.temp.max);
          });
          // chart
        }
      });*/
    }
  }
});









myApp.directive('sprkPlayer', function () {
    /* var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&callback=JSON_CALLBACK&q=";*/
    return {
        restrict: 'A',
        /* require: '^ngCity',*/
        scope: {
            sprkPlayer: '@'
        },
        templateUrl: 'pages/playerTemplate.html',
        controller: ['$scope', '$http', '$modal', function ($scope, $http, $modal) {


            $scope.animationsEnabled = true;

            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };

            $scope.gridsterOpts = {
                margins: [0, 0],
                outerMargin: false,
                pushing: true,
                floating: true,
                draggable: {
                    enabled: false
                },
                resizable: {
                    enabled: false,
                    handles: ['n', 'e', 's', 'w', 'se', 'sw']
                }
            };


            $scope.standardItems = [
                {
                    sizeX: 3,
                    sizeY: 2,
                    row: 0,
                    col: 0
            },
                {
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 2
            },
                {
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 4
            },
                {
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 5
            }
];


    }],



        link: function (scope, iElement, iAttrs, ctrl) {
            /*      scope.getTemp(iAttrs.ngCity);
                  scope.$watch('weather', function(newVal) {
                    // the `$watch` function will fire even if the
                    // weather property is undefined, so we'll
                    // check for it
                    if (newVal) {
                      var highs = [],
                          width   = 200,
                          height  = 80;

                      angular.forEach(scope.weather, function(value){
                        highs.push(value.temp.max);
                      });
                      // chart
                    }
                  });*/
        }
    }
});