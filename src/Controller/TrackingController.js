var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const FingerprintTracking = require('../Models/FingerprintTracking');
const WLANTraining = require('../Models/WLANFingerprint');
const NearestAlgoritm = require('../algoritm/knn/NearestNeighborAlgorithm');
const BayesAlgoritm = require('../algoritm/bayes/BayesAlgorithm');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/insertData', function(req, res){
    var post_data = req.body;

    FingerprintTracking.create({
        userId: post_data.id,
        date:new Date(post_data.date),
        algoritm: post_data.algoritm,
        sensorData: post_data.sensorData,
        wlanMeasurement: post_data.wlanMeasurement
    },
    function(err, fingerprint){
        if (err) return res.status(500).send("There was a problem insert tracking data`.");
        console.log("InsertedData. " + fingerprint.date);
        //res.send({status: "ok", message: "InsertedData."});    
    });
});

router.post('/TrackMe', function(req, res){
    var post_data = req.body;
    
    FingerprintTracking.create({
        userId: post_data.userId,
        date:new Date(post_data.date),
        algoritm: post_data.algoritm,
        sensorData: post_data.sensorData,
        wlanMeasurement: post_data.wlanMeasurement
    },function(err, fingerprint){
        if (err) return res.status(500).send("There was a problem insert tracking data`.");
        getWLANFingerprintWithBSSID(fingerprint, res);
       // res.send({status: "ok", message: "InsertedData." /*+ formattedDateTime(post_data.date)*/});    
    });
});

router.get('/test', function(req, res){
    FingerprintTracking.find({},function(err, fingerprintTrackingDatas){
        if(err)throw err;
        if(fingerprintTrackingDatas instanceof Array){
            for(j in fingerprintTrackingDatas){
                generateTestData(fingerprintTrackingDatas[j], res);
            } 
        }
        
    });

});

function formattedDateTime(d=new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    let year = String(d.getFullYear());
    let hour = String(d.getHours());
    let minute = String(d.getMinutes());
    let second = String(d.getSeconds());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
  }
  function formattedTime(d=new Date) {
    let hour = String(d.getHours());
    let minute = String(d.getMinutes());
    let second = String(d.getSeconds());
    
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;

    return `${hour}:${minute}:${second}`;
  }
function formattedDate(d=new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    let year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}.${month}.${year}`;
  }
  function formattedDbNameDate(d=new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    let year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}${month}${year}`;
  }
var getWLANFingerprintWithBSSID = function(trackingData, res)
{
    var definedBSSID=[];  
    var ab = trackingData.wlanMeasurement;
    
    for(i in ab)
    {
        var BSSID = ab[i].bssid;
        definedBSSID.push(BSSID);     
    }
    
    WLANTraining.find({'wlanMeasurement.bssid': {$in: definedBSSID}})   
    .populate('Fingerprint')
    .exec(function(err,fingerprints) {
        var fingerPrintDataMap = {};

        if(err) throw err;        
        fingerprints.forEach(element => {    
            //console.log(element);
            fingerPrintDataMap[element._id] = element;
        });  

        try
        {
            var coordinate = NearestAlgoritm.calculatePosition(fingerPrintDataMap, trackingData); 
            InsertTestDbData(trackingData, "NearestBasic",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionKNN(fingerPrintDataMap, trackingData, 3); 
            InsertTestDbData(trackingData, "NearestKNN3",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionKNN(fingerPrintDataMap, trackingData, 5); 
            InsertTestDbData(trackingData, "NearestKNN5",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionWKNN(fingerPrintDataMap, trackingData, 3); 
            InsertTestDbData(trackingData, "NearestWKNN3",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionWKNN(fingerPrintDataMap, trackingData, 5); 
            InsertTestDbData(trackingData, "NearestWKNN5",coordinate,res);            

            //console.log("InsertedMyTrackingData.");
            res.status(200).send("InsertedMyTrackingData." + trackingData.date);    
        }
        catch(ex){
            return res.status(500).send(ex);
        }
        finally{

        }

        
    });
}

var generateTestData = function(trackingData, res)
{
    var definedBSSID=[];  
    var ab = trackingData.wlanMeasurement;
    
    for(i in ab)
    {
        var BSSID = ab[i].bssid;
        definedBSSID.push(BSSID);     
    }
    
    WLANTraining.find({'wlanMeasurement.bssid': {$in: definedBSSID}})   
    .populate('Fingerprint')
    .exec(function(err,fingerprints) {
        var fingerPrintDataMap = {};

        if(err) throw err;        
        fingerprints.forEach(element => {    
            fingerPrintDataMap[element._id] = element;
        });  

        try
        {
            var coordinate = NearestAlgoritm.calculatePosition(fingerPrintDataMap, trackingData); 
            InsertTestDbData(trackingData, "NearestBasic",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionKNN(fingerPrintDataMap, trackingData, 3); 
            InsertTestDbData(trackingData, "NearestKNN3",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionKNN(fingerPrintDataMap, trackingData, 5); 
            InsertTestDbData(trackingData, "NearestKNN5",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionWKNN(fingerPrintDataMap, trackingData, 3); 
            InsertTestDbData(trackingData, "NearestWKNN3",coordinate,res);
            coordinate = NearestAlgoritm.calculatePositionWKNN(fingerPrintDataMap, trackingData, 5); 
            InsertTestDbData(trackingData, "NearestWKNN5",coordinate,res);     
            
            res.status(200).send("InsertedMyTrackingData." + trackingData.date);    
        }
        catch(ex){
            return res.status(500).send(ex);
        }
        finally{

        }
        
    });
}

var InsertTestDbData=function(trackingData,algoritmName,coordinate,res){
    
    var myDate = trackingData.date;
            
    if(trackingData.date instanceof String){
        myDate = new Date(trackingData.date);
    }

    var location = coordinate.X + " " + coordinate.Y;
    var _dbNameDate = formattedDbNameDate(myDate);
    var _time = formattedTime(myDate);    
    var _date = formattedDate(myDate);
    var collectionName = "IPS_Db_" + _dbNameDate;
    var MyTrackingData = require('../Models/IPSDBData')(collectionName);

    var insertingData = new MyTrackingData({
        trackingDataId: trackingData._id,
        name: trackingData.userId,
        location: location,
        layout: coordinate.mapName,
        date: _date,
        time: _time,
        algorithm: algoritmName
    });
    insertingData.save(function (err){
        if(!err){
            console.log("InsertedMyTrackingData." + _date + " " + _time);
            //return res.status(200).send("InsertedMyTrackingData.");
            
        }
        else{
            console.log("There was a problem insert MyTracking data`.");
            //res.status(500).send("There was a problem insert MyTracking data`.");
        }
            
    });
}

var WeightedAlgo = function(DistanceResults, trackingData)
{
    var distances_list = [],
		avg = 0.0,
		total_weight = 0.0,
		i,
		index, // distance_list's item has an index property!
		weight,
		distance

	k              = 5
	weight_func    = gaussianWeight

	// get weighted average
	for( i =0; i < k; i++){
		distance     = DistanceResults[i].distance
		index        = i
		weight       = weight_func(distance)
		avg          += weight * trackingData.powerLevels
		total_weight += weight
	}// for

	total_weight = total_weight === 0? 0.01 : total_weight // verifying we won't divide by zero!
	avg /= total_weight
	return avg
}

// the weight is 1 when distance is 0 and the weight declines
// as the distance increases. Unlike the subtraction, weight never falls all the way to 0
// always possible to make a prediction
function gaussianWeight(distance, sigma){
	sigma = sigma || 10.0
	return Math.exp( - (distance * distance * 10 * 10) /  (2 * sigma * sigma))
}


module.exports = router;
