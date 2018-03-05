var express = require('express');

var WlanFingerprint = require('../../Models/WLANFingerprint');
var Sort = require('./QuickSort');

var SEQUENTIAL_CUTOFF = 100;
var fps = {};
var mm = {};
var low;
var high;
var iK;
    
//Best One
module.exports.calculatePosition = function(WLANFingerprints,trackingData){

    iK = 1;
    low = 0;
    high = Object.keys(WLANFingerprints).length;
    var distances = computeDistance(WLANFingerprints,trackingData,low,high);     
    var smallestDistance = findSmallestDistance(distances);

    var NNResult = {
        mapName : smallestDistance[0].mapName,
        X : smallestDistance[0].X,
        Y : smallestDistance[0].Y
    }
    return NNResult;
    //return smallestDistance[0].X + " " + smallestDistance[0].Y;
}

//Average of the K locations that have the shortest distances D
module.exports.calculatePositionKNN = function(WLANFingerprints,trackingData,K){

    iK = K;
    low = 0;
    high = Object.keys(WLANFingerprints).length;
    var distances = computeDistance(WLANFingerprints,trackingData,low,high); 
    var X,Y,SumX = 0,SumY=0;
    var map_Name = "";

    var smallestDistance = findSmallestDistance(distances);
    for(var i = 0; i<iK; i++)
    {
        map_Name = smallestDistance[i].mapName;
        X = parseInt(smallestDistance[i].X);
        Y = parseInt(smallestDistance[i].Y);

        SumX += X;
        SumY += Y;
    }

    SumX /= iK;
    SumY /= iK; 

    var NNResult = {
        mapName : map_Name,
        X : SumX,
        Y : SumY
    }

    return NNResult;

    //return SumX + " " + SumY;
}

//Calculates the Weighted Average of the K locations that have the shortest distances D
module.exports.calculatePositionWKNN = function(WLANFingerprints,trackingData,K){

    iK = K;
    low = 0;
    high = Object.keys(WLANFingerprints).length;

    var LocationWeight = 0;
    var sumWeights = 0;
    var WeightedSumX = 0;
    var WeightedSumY = 0;
    var map_FileName = "";


    var distances = computeDistance(WLANFingerprints,trackingData,low,high); 
    
    var smallestDistance = findSmallestDistance(distances);

    for(var i = 0; i<iK; i++)
    {
        map_FileName = smallestDistance[i].mapName;
        LocationWeight = 1 / smallestDistance[i].distance;

        X = parseInt(smallestDistance[i].X);
        Y = parseInt(smallestDistance[i].Y);

        sumWeights += LocationWeight;
        WeightedSumX += LocationWeight * X;
        WeightedSumY += LocationWeight * Y;
    }

    WeightedSumX /= sumWeights;
    WeightedSumY /= sumWeights;

    var NNResult = {
        mapName : map_FileName,
        X : WeightedSumX,
        Y : WeightedSumY
    }

    return NNResult;
    //WeightedSumX + " " + WeightedSumY;
}

var computeDistance = function(WLANFingerprints,trackingData,Low,High){
    var keys = Object.keys(WLANFingerprints);
    var results = {};

    if (high - low < SEQUENTIAL_CUTOFF) 
    {
        for (var i = low; i < high; i++) {

            var fp = WLANFingerprints[keys[i]];
            //console.log("FingerPrint: " + fp);
            var result = calcEuclDist(trackingData, fp);
            if(result != null)
                results[i] = result;
            else
                console.log("CalcEcl is null");
        }
    }
    else
    {

    }
    //console.log("Results:" + results);
    return results;
}

var calcEuclDist = function(trackingData, WLANFingerprint){
    var d = 0;
    var nrOfMatchedBssids = 0;      
    var result={};
    var wlanMeasurements = {};
    wlanMeasurements = trackingData.wlanMeasurement;

    wlanMeasurements.forEach(element => {
        var BSSID = element.bssid;
        if(BSSID !== undefined){            
            var powerLevels = element.powerLevels;        
            var keys = Object.keys(element);

            //console.log("PowerLevels " + powerLevels);
            if(powerLevels === undefined)
                console.log(powerLevels);


            var averageLevel = getAverageLevel(WLANFingerprint, BSSID);        
            if(averageLevel != null )
            {
                //console.log("Average:" + averageLevel);

                var val = (powerLevels - averageLevel);
                //console.log("val:" + averageLevel);

                d += Math.pow(val, 2);

                nrOfMatchedBssids++;
                
            }
        }
        else
            console.log("BSSID is undefiend");                
    });

    if(nrOfMatchedBssids != 0){
        if(nrOfMatchedBssids != 0){
            var distanceResult = {
                distance: Math.sqrt(d),
                matchedBssids: nrOfMatchedBssids,
                date:trackingData.date,
                userId : trackingData.userId,
                mapName : WLANFingerprint.mapFileName,
                X : WLANFingerprint.X,
                Y : WLANFingerprint.Y,
                fingerprintTrainingId: WLANFingerprint._id
            }
        }

        return distanceResult;
    }

    return null;
}


var findSmallestDistance = function(DistanceResults){
    var sortedDistanceResult = Sort.sort(DistanceResults);
    
    var keys = Object.keys(sortedDistanceResult);

    var PARTIAL_AMOUNT = iK;

    if (keys.length < PARTIAL_AMOUNT) {

        K = keys.length;
        //console.log(PARTIAL_AMOUNT);
    }    

    var partialSet=[];
    var size = (keys.length - 1);
    var j = 0;
    for (var i = size; i > (size - PARTIAL_AMOUNT); i--) {

        partialSet[j++] = sortedDistanceResult[keys[i]];
    }

    var sortedByDistance = {};
    sortedByDistance = Sort.insertionSort(partialSet);
    return sortedByDistance;    
    //console.log(sortedDistanceResult.length);
}

var getAverageLevel = function(WLANFingerprint,BSSID){    
    var wlan = WLANFingerprint.wlanMeasurement;
    try{    
        for(i in wlan){
            var ap = wlan[i];
            //console.log("ap: " + ap);
            if(ap.bssid == BSSID){
                var sum = 0;
                var count = 0;
                var powerLevels = {};
                powerLevels = ap.powerLevels;

                for(var j = 0; j < powerLevels.length; j++){
                    //console.log(powerLevels[j]);
                    var iLevel = parseInt(powerLevels[j])
                    if(iLevel !== NaN){
                        sum += iLevel ;                              
                    }                    
                }               
                var avg = sum / powerLevels.length;                
                return avg;
            }
        }
    }
    catch(ex){
       return null;
    }    

    return null;
}