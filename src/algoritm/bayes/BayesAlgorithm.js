var express = require('express');

var bssids = [];
var probabalityGreek;
var SEQUENTIAL_CUTOFF = 100;
var fps = {};
var mm = {};
var low;
var high;
var iK;

// Calculates user location based on Probabilistic Maximum A Posteriori
// (MAP) Algorithm or Probabilistic Minimum Mean Square Error (MMSE)
// Algorithm
module.exports.calculatePosition = function(WLANFingerprints,trackingData)
{
    probabalityGreek = 1;
    low = 0;
    high = Object.keys(WLANFingerprints).length;
    return computeDistance(WLANFingerprints,trackingData,low,high);     
}

module.exports.calculateProbabilityPosition = function(WLANFingerprints,trackingData,greek)
{
    probabalityGreek = greek;
    var highestProbability = Number.NEGATIVE_INFINITY;
    var X,Y;
    low = 0;
    high = Object.keys(WLANFingerprints).length;
    var distances ={};
    distances = computeDistance(WLANFingerprints,trackingData,low,high);     

    for(var i = 0; i<distances.length; i++)
    {
        var distance = parseInt(distances[i].distance);

        if(distance == Number.NEGATIVE_INFINITY){
            return null;
        }
        else if(distance > highestProbability){
            highestProbability = distance;
            X = distances[i].X;
            Y = distances[i].Y;
        }
    }

    return X + " " + Y;
}

// Calculates the Weighted Average over ALL locations where the weights are
// the Normalized Probabilities
module.exports.calculateWeightedAverageProbabilityLocations = function(WLANFingerprints,trackingData,greek)
{
    probabalityGreek = greek;
    var sumProbabilities = 0;
    var WeightedSumX = 0;
    var WeightedSumY = 0;
    var NP;
    var x, y;
        
    var highestProbability = Number.NEGATIVE_INFINITY;
    var X,Y;
    low = 0;
    high = Object.keys(WLANFingerprints).length;
    var distances ={};
    distances = computeDistance(WLANFingerprints,trackingData,low,high);         

    for(var i = 0; i<distances.length; i++)
    {
        sumProbabilities += parseInt(distances[i].distance);
    }

    for(var i = 0; i<distances.length; i++)
    {
        X = parseInt(distances[i].X);
        Y = parseInt(distances[i].Y);

        NP = distances(i).distance / sumProbabilities;

        WeightedSumX += (x * NP);
        WeightedSumY += (y * NP);
    }

    return WeightedSumX + " " + WeightedSumY;
}
var computeDistance = function(WLANFingerprints,trackingData,Low,High){
    var keys = Object.keys(WLANFingerprints);
    var results = {};

    if (high - low < SEQUENTIAL_CUTOFF) 
    {
        for (var i = low; i < high; i++) {

            var fp = WLANFingerprints[keys[i]];
            //console.log("FingerPrint: " + fp);
            var result = calcProbabilityDistance(trackingData, fp);
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

var calcProbabilityDistance = function(trackingData, WLANFingerprint)
{
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

                val = Math.pow(val, 2);
                val = -val;
                val /= Math.pow(probabalityGreek, 2);
                //double) (sGreek * sGreek);
                val = Math.exp(val);
                
			    d *= val;

                nrOfMatchedBssids++;
                
            }
        }
        else
            console.log("BSSID is undefiend");                
    });

    if(nrOfMatchedBssids != 0){
        if(nrOfMatchedBssids != 0){
            var distanceResult = {
                distance: d,
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