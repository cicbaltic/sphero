myApp.controller('sprkSpeedoChartCtrl', ['$scope', '$interval', '$modal', 'couchdbService', 'id', function ($scope, $interval, $modal, couchdbService, id)
    {
        $scope.id = id;

        $scope.colorList = [];

        $scope.calcColor = function (direction) {
            if (direction >= 0 && direction < 45) {
                return '#89D011'; //red
            } else if (direction >= 45 && direction < 135) {
                return '#FAD300'; //red
            } else if (direction >= 135 && direction < 225) {
                return '#FF5050'; //red
            } else if (direction >= 225 && direction < 315) {
                return '#00B19E'; //red
            } else if (direction >= 315 && direction <= 360) {
                return '#89D011'; //red
            }
        }

        $scope.chartOptions = {
            title: {
                x: 'center',
                /*        text: 'ECharts例子个数统计',
                        subtext: 'Rainbow bar example',
                        link: 'http://echarts.baidu.com/doc/example.html'*/
            },
            tooltip: {
                show: false,
                trigger: 'item'
            },
            toolbox: {
                show: false,
                feature: {
                    dataView: {
                        show: false,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            calculable: true,
            grid: {
                borderWidth: 0,
                y: 20,
                y2: 30
            },
            xAxis: [
                {
                    type: 'category',
                    show: false,
                    data: []
        }
    ],
            yAxis: [
                {
                    type: 'value',
                    show: false
        }
    ],
            series: [
                {
                    name: 'Throw',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = $scope.colorList;

                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            }
                        }
                    },
                    data: [1],
                    markPoint: {
                        tooltip: {
                            trigger: 'item',
                            backgroundColor: 'rgba(0,0,0,0)',

                        },
                        data: [
       /*             {xAxis:0, y: 350, symbolSize:0},
                    {xAxis:1, y: 350, symbolSize:0},
                    {xAxis:2, y: 350, symbolSize:0},
                    {xAxis:3, y: 350, symbolSize:0},
                    {xAxis:4, y: 350, symbolSize:0}*/
                ]
                    }
        }
    ]
        };

        $scope.$on('PLAYER_THROW', function (event, args) {

            if (args.playerID === $scope.playerID) {
                $scope.drawThrow(args);
            }
        });

        $scope.drawThrow = function (args) {
            $scope.$apply(function () {

                $scope.chartOptions.xAxis[0].data.push(1);
                $scope.chartOptions.series[0].data.push(args.maxAccel);
                $scope.colorList.push($scope.calcColor(args.direction));

                $scope.myChart = echarts.init(document.getElementById($scope.id));

                $scope.myChart.setOption($scope.chartOptions);


            });
        }

    }]);