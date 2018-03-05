var express = require('express');

var WlanFingerprint = require('../../Models/WLANFingerprint');
var Sort = require('./QuickSort');
const Distance = require('../distance');
    
module.exports.calculatePosition = function(WLANFingerprints,trackingData){

    low = 0;
    high = Object.keys(WLANFingerprints).length;
    var distances = computeDistance(WLANFingerprints,trackingData,low,high); 

    var keys = Object.keys(distances);
    var length = keys.length;
    
    
    return findSmallestDistance(distances);
}

var computeDistance = function(WLANFingerprints,trackingData,Low,High){
    var keys = Object.keys(WLANFingerprints);
    var results = {};

    if (high - low < SEQUENTIAL_CUTOFF) 
    {
        for (var i = low; i < high; i++) {

            var fp = WLANFingerprints[keys[i]];
            //console.log("FingerPrint: " + fp);
            var result = calcEuclDist(trackingData, fp, i);
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

function calcEuclDist(trackingData, WLANFingerprint, counter){
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
                d +=  Distance.euclidean([averageLevel],[powerLevels]);
                //Math.pow(val, 2);
                nrOfMatchedBssids++;
                
            }
        }
        else
            console.log("BSSID is undefiend");                
    });

    if(nrOfMatchedBssids != 0){
        if(nrOfMatchedBssids != 0){
            var distanceResult = {
                index : counter,
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



// weighted kNN 
function weightedkNN(data, vec, k, weight_func){
	var distances_list = [],
		avg = 0.0,
		total_weight = 0.0,
		i,
		index, // distance_list's item has an index property!
		weight,
		distance

	k              = k || 5
    weight_func    = weight_func || gaussianWeight
    
    // get distances
	distances_list = getDistances(data, vec)

	// get weighted average
	for( i =0; i < k; i++){
		distance     = distances_list[i].distance
		index        = distances_list[i].index
		weight       = weight_func(distance)
		avg          += weight * data[index].price
		total_weight += weight
	}// for

	total_weight = total_weight === 0? 0.01 : total_weight // verifying we won't divide by zero!
	avg /= total_weight
	return avg
}

// building a distance list
function getDistances(data, vec){
	var distance_list = [],
		i,
		len = data.length,
		vec2

	for(i = 0; i < len; i++){
		vec2 = data[i]
		distance_list.push({index: i, distance: Distance.euclidean([vec2.rating,vec2.age],[vec.rating,vec.age])})
	}// for
	distance_list = _.sortBy(distance_list,'distance')
	return distance_list
}

// the weight is 1 when distance is 0 and the weight declines
// as the distance increases. Unlike the subtraction, weight never falls all the way to 0
// always possible to make a prediction
function gaussianWeight(distance, sigma){
	sigma = sigma || 10.0
	return Math.exp( - (distance * distance * 10 * 10) /  (2 * sigma * sigma))
}

