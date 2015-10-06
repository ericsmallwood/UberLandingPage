/**
 * Created by ESmallwood on 9/25/2015.
 */
/**
 * Created by ESmallwood on 9/22/2015.
 */
var app = angular.module('app', []);
app.constant('CONSTANTS', {
    WORKDAYS_OF_THE_YEAR: 241,
    PRICE_PER_LITRE_AUS: 1.4,
    FUEL_CONSUMPTION_PER_100KM: 7,
    DEPRECIATION:.12,
    SERVICE_COST_PER_YEAR: 120,
    INSURANCE_COST_PER_YEAR: 250,
    TAX_COST_PER_YEAR: 256,
    FINANCING_COST_PPY: .08,
    PARKING_COST_PER_DAY: 3,
    UBER_PRICE_PER_MIN: .1,
    UBER_PRICE_PER_KM:.41
});


app.controller('ctrl', function($scope, CONSTANTS){
    $scope.carCost = 15000;
    $scope.distanceToWork = 10;
    $scope.timeToWork = 30;
    $scope.$watch("[carCost, distanceToWork, timeToWork]", function(newValue, oldValue){
        var financingCost = ($scope.carCost * CONSTANTS.FINANCING_COST_PPY);
        var gasCost = ($scope.distanceToWork * 2) * CONSTANTS.WORKDAYS_OF_THE_YEAR *
            (CONSTANTS.FUEL_CONSUMPTION_PER_100KM /100)* CONSTANTS.PRICE_PER_LITRE_AUS;
        var costOfDepreciation = $scope.carCost * CONSTANTS.DEPRECIATION;
        var miscellaneousCosts = CONSTANTS.SERVICE_COST_PER_YEAR + CONSTANTS.INSURANCE_COST_PER_YEAR +
            CONSTANTS.TAX_COST_PER_YEAR;
        var parkingCost = CONSTANTS.PARKING_COST_PER_DAY + CONSTANTS.WORKDAYS_OF_THE_YEAR;
        var timeCost = CONSTANTS.UBER_PRICE_PER_MIN * ($scope.timeToWork * 2) * CONSTANTS.WORKDAYS_OF_THE_YEAR;
        var distanceCost = CONSTANTS.UBER_PRICE_PER_KM * ($scope.distanceToWork * 2) * CONSTANTS.WORKDAYS_OF_THE_YEAR;
        $('#chart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: config.chartText.chartTitle
            },
            xAxis: {
                categories: [config.chartText.bar1Text, config.chartText.bar2Text]
            },
            yAxis: {
                min: 0,
                title: {
                    text: config.chartText.yAxisText
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: config.chartText.financing,
                data: [financingCost]
            }, {
                name: config.chartText.gas,
                data: [gasCost]
            },{
                name: config.chartText.depreciation,
                data: [costOfDepreciation]
            },{
                name: config.chartText.miscellaneous,
                data: [miscellaneousCosts]
            },{
                name: config.chartText.parking,
                data: [parkingCost]
            },{
                name: config.chartText.time,
                data: [0, timeCost]
            }, {
                name: config.chartText.distance,
                data: [0, distanceCost]
            }
            ]

        });

        var totalCostOfCar = financingCost + gasCost + costOfDepreciation + miscellaneousCosts + parkingCost;
        var totalUberCost = timeCost + distanceCost;
        var totalDrivingTime = ((($scope.timeToWork * 2) * CONSTANTS.WORKDAYS_OF_THE_YEAR)/60).toFixed(0);
        var text;
        if(totalUberCost < totalCostOfCar){
            var percentageSavings = Math.round((1 - ((totalUberCost)/totalCostOfCar)) * 100);
            var monetarySavings = (totalCostOfCar - totalUberCost).toFixed(0);

            text = "Uber is " + percentageSavings + "% cheaper<br>than using your own car<br>saving you " + monetarySavings
            + " EUR<br>and " + totalDrivingTime + " hours per year!"
        }else{
            text = "If you are prepared to spend<br>" + totalDrivingTime + " hours driving per year,<br>then it might be better" +
            " for you<br>to use your own car...";
        }

        $('#resultText').html(text);
    }, true);
});
