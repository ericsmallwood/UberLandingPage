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
    $scope.carCost = 0;
    $scope.distanceToWork = 0;
    $scope.timeToWork = 0;
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
                text: 'Cost Comparison'
            },
            xAxis: {
                categories: ["Owning a Car", "The Uber Alternative"]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Cost'
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
                name: 'Financing Cost',
                data: [financingCost]
            }, {
                name: 'Gas Cost',
                data: [gasCost]
            },{
                name: 'Depreciation',
                data: [costOfDepreciation]
            },{
                name: 'Miscellaneous',
                data: [miscellaneousCosts]
            },{
                name: 'Parking',
                data: [parkingCost]
            },{
                name: 'Time Cost',
                data: [0, timeCost]
            }, {
                name: 'Distance Cost',
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
            var monetarySavings = (totalCostOfCar - totalUberCost).toFixed(2);

            text = "Uber is " + percentageSavings + "% cheaper<br>than using your own car<br>saving you " + monetarySavings
            + " EUR<br>and " + totalDrivingTime + " hours per year!"
        }else{
            text = "If you are prepared to spend<br>" + totalDrivingTime + " hours driving per year,<br>then it might be better" +
            " for you<br>to use your own car...";
        }

        $('#resultText').html(text);
    }, true);
});
