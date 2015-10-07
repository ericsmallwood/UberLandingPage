/**
 * Created by ESmallwood on 9/22/2015.
 */

$(document).ready(function(){

    var model = {
        carType: {
            carType: "compact"
        },
        values: {
            carCost: 0,
            distanceToWork: 10,
            timeToWork: 30,
            fuelConsumption: 0,
            insurance: 0,
            serviceCost: 0,
            tax: 0
        }
    };

    rivets.bind($("body"), model);

    //initializeChart
    getCartType();
    generateChart();

    //watch for changes
    watch(model, "values", function(){
        generateChart();
    });

    //watch for cartype selection
    watch(model, "carType", function(){
        getCartType();
    });



    function getCartType(){
        if(model.carType.carType == "compact"){
            setCosts(10000, 6, 180, 200, 138);
        }else if(model.carType.carType == "sedan"){
            setCosts(13500, 8, 220, 300, 265)
        }else if(model.carType.carType == "suv"){
            setCosts(15000, 8, 220, 300, 265);
        }else{
            setCosts(25000, 10, 300, 350, 300);
        }
    }

    function setCosts(carPrice, fuel, insurance, service, tax){
        model.values.carCost = carPrice;
        model.values.fuelConsumption = fuel;
        model.values.insurance = insurance;
        model.values.serviceCost = service;
        model.values.tax = tax;
    }

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
