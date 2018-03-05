var express = require('express');
var _ = require('underscore');

var DistanceResults;
var keys;

module.exports.sort = function(distanceResults){
    DistanceResults = distanceResults;
    //console.log("DistanceResults:" + DistanceResults);
    if (typeof DistanceResults !== "undefined" && DistanceResults !== null) {
        //console.log("DistanceLenght:" + Object.keys(DistanceResults).length);
        keys = Object.keys(DistanceResults);
        var length = keys.length;
        DistanceResults = _.sortBy(DistanceResults,'matchedBssids');
        //console.log("DistanceLenght" + length);
        //QuickSort(0, length-1);
    }
    return DistanceResults;
}
module.exports.insertionSort = function(distanceResults){
    DistanceResults = distanceResults;
    //console.log("DistanceResults:" + DistanceResults);
    if (typeof DistanceResults !== "undefined" && DistanceResults !== null) {
       // console.log("DistanceLenght:" + Object.keys(DistanceResults).length);
        keys = Object.keys(DistanceResults);
        var length = keys.length;
        //console.log("DistanceLenght" + length);
        //InsertSortByDistance();
        DistanceResults = _.sortBy(DistanceResults,'distance');
    }
    return DistanceResults;
}

var InsertSortByDistance = function(){
    keys = Object.keys(DistanceResults);
    for(var i = 0; i<keys.length; i++){

        var Distances = DistanceResults[keys[i]];
        var iHole = i;

        while((iHole > 0) && (DistanceResults[keys[iHole - 1]].distance > Distances.distance))
        {
            DistanceResults[keys[iHole]] = DistanceResults[keys[iHole--]];
        }
        DistanceResults[keys[iHole]] = Distances;
    }

}

var QuickSort = function(low, high){    
    var i = low;
    var j = high;

    var distanceResult = DistanceResults[keys[parseInt(low + (high - low) / 2)]];
    //console.log("QuickSort : " + low + (high - low) / 2);
    //console.log("Distanceee:" + distanceResult.distance);

    var pivot = distanceResult.matchedBssids;
    //console.log("Pivot : " + pivot);


    while(i <= j){

        while (DistanceResults[keys[i]].matchedBssids < pivot) {
            i++;
        }

        while (DistanceResults[keys[j]].matchedBssids > pivot) {
            j--;
        }

        if (i <= j) {
            swap(i, j);
            i++;
            j--;
        }
    }

    if (low < j)
        QuickSort(low, j);
		if (i < high)
            QuickSort(i, high);
}

var swap = function (i, j){
    var distanceResult = DistanceResults[keys[i]];
    DistanceResults[keys[i]] = DistanceResults[keys[j]];
    DistanceResults[keys[j]] = distanceResult;
}
