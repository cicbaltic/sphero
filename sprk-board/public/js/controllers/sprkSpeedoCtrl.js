myApp.controller('sprkSpeedoCtrl', ['$scope', '$interval', '$modal', 'couchdbService', 'id', function ($scope, $interval, $modal, couchdbService, id)
    {
        $scope.playerID = id;

        $scope.calcColors = function (direction) {
            var colors = [];

            for (i = 0; i < 4; i++) {
                colors[i] = '#3B4B54';
            }

            if (direction >= 0 && direction < 45) {
                colors[0] = '#89D011';
            } else if (direction >= 45 && direction < 135) {
                colors[1] = '#FAD300';
            } else if (direction >= 135 && direction < 225) {
                colors[2] = '#FF5050';
            } else if (direction >= 225 && direction < 315) {
                colors[3] = '#00B19E';
            } else if (direction >= 315 && direction <= 360) {
                colors[0] = '#89D011';
            }
            return colors;
        }

        $scope.gaugeOptions = {
            tooltip: {
                show: false
                    //        formatter: "{a} <br/>{b} : {c}°"
            },
            toolbox: {
                show: false
            },
            series: [
                {
                    name: 'Direction',
                    type: 'gauge',
                    center: ['50%', '50%'],
                    radius: [100, '100%'],
                    startAngle: 90,
                    endAngle: -270,
                    min: 0,
                    max: 360,
                    precision: 10,
                    splitNumber: 360,
                    axisLine: {
                        show: true,
                        splitNumber: 4,
                        lineStyle: {
                            width: '0.5%'
                        }
                    },
                    axisTick: {
                        show: true,
                        splitNumber: 2,
                        length: 5,
                        lineStyle: {
                            color: '#00B299',
                            width: 1,
                            type: 'solid',
                            //                    color: 
                        }
                    },
                    axisLabel: {
                        show: true,
                        formatter: function (v) {
                            switch (v + '') {
                            case '0':
                                return '0°';
                            case '90':
                                return '90°';
                            case '180':
                                return '180°';
                            case '270':
                                return '270°';
                            default:
                                return '';
                            }
                        },
                        textStyle: {
                            color: '#333'
                        }
                    },
                    splitLine: {
                        show: false,
                        length: 30,
                        lineStyle: {
                            color: '#eee',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    pointer: {
                        length: '120%',
                        width: 14,
                        color: 'black' // auto
                    },
                    title: {
                        show: false,
                        offsetCenter: ['-65%', -10],
                        textStyle: {
                            color: '#333',
                            fontSize: 15
                        }
                    },
                    detail: {
                        show: true,
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 0,
                        borderColor: '#ccc',
                        width: 100,
                        height: 40,
                        offsetCenter: ['1%', 20],
                        formatter: '{value}°',
                        textStyle: {
                            color: 'black',
                            fontSize: 30
                        }
                    },
                    data: [{
                        value: '',
                        name: ''
                    }]
        }
    ]
        };

        $scope.drawThrow = function (args) {
            $scope.$apply(function () {

                $scope.gaugeOptions.series[0].data[0].value = args.direction;
                $scope.gaugeOptions.series[0].axisLine.lineStyle.width = Math.min((args.maxAccel * 2), 100) + '%';

                var colors = $scope.calcColors(args.direction);

                $scope.gaugeOptions.series[0].axisLine.lineStyle.color = [
                      [-0.125, colors[3]],
                    [0.125, colors[0]],
                    [0.375, colors[1]],
                    [0.625, colors[2]]
                ];

                $scope.myChart.setOption($scope.gaugeOptions);
            });
        }

        $scope.drawGauge = function () {
            $scope.myChart = echarts.init(document.getElementById(id));

            $scope.myChart.setOption($scope.gaugeOptions);

            $scope.$on('PLAYER_THROW', function (event, args) {

                if (args.playerID === $scope.playerID) {
                    $scope.drawThrow(args);
                } else {
                    console.log($scope.playerID + " " + args.playerID);
                }
            });

        }
        $scope.drawGauge();

    }]);