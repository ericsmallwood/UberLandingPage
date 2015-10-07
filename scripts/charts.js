/**
 * Created by ESmallwood on 9/22/2015.
 */

$(document).ready(function(){

    var model = {
        values: {
            carCost: 15000,
            distanceToWork: 10,
            timeToWork: 30,
            fuelConsumption: config.constants.FUEL_CONSUMPTION_PER_100KM,
            insurance: config.constants.INSURANCE_COST_PER_YEAR,
            serviceCost: config.constants.SERVICE_COST_PER_YEAR,
            tax: config.constants.TAX_COST_PER_YEAR
        }
    };
    rivets.bind($("body"), model);

    //initializeChart
    generateChart();

    //watch for changes
    watch(model, "values", function(){
        generateChart();
    });

    function generateChart(){
        var financingCost = (model.values.carCost * config.constants.FINANCING_COST_PPY);
        var gasCost = (model.values.distanceToWork * 2) * config.constants.WORKDAYS_OF_THE_YEAR *
            (model.values.fuelConsumption /100)* config.constants.PRICE_PER_LITRE_AUS;
        var costOfDepreciation = model.values.carCost * config.constants.DEPRECIATION;
        var miscellaneousCosts = model.values.serviceCost + model.values.insurance +  model.values.tax;
        var parkingCost = config.constants.PARKING_COST_PER_DAY + config.constants.WORKDAYS_OF_THE_YEAR;
        var timeCost = config.constants.UBER_PRICE_PER_MIN * (model.values.timeToWork * 2) * config.constants.WORKDAYS_OF_THE_YEAR;
        var distanceCost = config.constants.UBER_PRICE_PER_KM * (model.values.distanceToWork * 2) * config.constants.WORKDAYS_OF_THE_YEAR;
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
        var totalDrivingTime = (((model.values.timeToWork * 2) * config.constants.WORKDAYS_OF_THE_YEAR)/60).toFixed(0);
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
    };
});
