//var mongoDb = require('mongodb');

const mongoose = require('mongoose');
const Fingerprint = require('../Models/WLANFingerprint');
const User = require('../Models/UserAggreement');
const NearestAlgoritm = require('../algoritm/knn/NearestNeighborAlgorithm');
const FingerprintTracking = require('../Models/FingerprintTracking');
var User = require('../Models/User');

var VerifyToken = require('./auth/VerifyToken');

module.exports.getAllData = function(req, res)
{
    var fingerPrintData = new Fingerprint();
    
    Fingerprint.find({}, function(err,fingerprints) {
        var fingerPrintDataMap = {};
        fingerprints.forEach(element => {
            fingerPrintDataMap[element._id] = element;                        
        });
        res.send(fingerPrintDataMap);
    });
}

module.exports.getWLANFingerprintWithBSSID = function(bssids)
{
    var fingerPrintData = new Fingerprint();
    var definedBSSID=[];
   // console.log(bssids.wlanMeasurement.lenght);
    for(i in bssids.wlanMeasurement){
        var BSSID = bssids.wlanMeasurement[i].bssid;
        definedBSSID.push(BSSID);     
    }

    //definedBSSID= definedBSSID.substring(0, definedBSSID.length - 1);

    var powerLevels = bssids.wlanMeasurement[i].powerLevels;
        Fingerprint.find({'wlanMeasurement.bssid': {$in: definedBSSID}})
        .populate('Fingerprint')
        .exec(function(err,fingerprints) {
            var fingerPrintDataMap = {};

            if(err) throw err;        
            fingerprints.forEach(element => {            
                //console.log(element.wlanMeasurement);            
                //console.log(element.bssid);
                
                //console.log(element);
                fingerPrintDataMap[element._id] = element;
                
                //fingerPrintDataMap[element.wlanMeasurement] = element.wlanMeasurement;    
            });            
            NearestAlgoritm.calculatePosition(fingerPrintDataMap, bssids);
        });

    /*var keys = Object.keys(fingerPrintDataMap);
    if(keys.length>1)
    {
        NearestAlgoritm.calculatePosition(fingerPrintDataMap, bssids);
    }*/
    
}

function hasElement(array, value){
    var keys = Object.keys(array);
    for(var i = 0; i<keys.length;i++){
        var ap = array[keys[i]];
        if(ap == value) {
            return true;
        }
    }
    return false;
}

module.exports.insertAggremenData = function(req, res)
{
    var post_data = req.body;

    var userAggrData = new User({
        userId:post_data.id,
        date:post_data.date
    });

    userAggrData.save(function (err){
        if(!err){
            User.find({})
            .populate('userId')
            .exec(function(error, posts){
                res.send({status: "ok", message: "Received."});
                res.end(JSON.stringify(posts,null, "\t"));
            })            
        }
        else
            throw err;
    });
}

module.exports.insertTrainingData = function(req, res)
{

    var post_data = req.body;

    var trainingData = new Fingerprint({
        mapId: post_data.mapId,
        mapFileName: post_data.mapFileName,
        gridsSize: post_data.gridsSize,
        X: post_data.X,
        Y: post_data.Y,
        leftX: post_data.leftX,
        topY: post_data.topY,
        rightX: post_data.rightX,
        bottomY: post_data.bottomY,
        date: post_data.date,
        wlanMeasurement: post_data.wlanMeasurement
    });    

    //console.log(trainingData);

    trainingData.save(function (err){
        if(!err){
            Fingerprint.find({})
            .populate('mapId')
            .exec(function(error, posts){
                res.end(JSON.stringify(posts,null, "\t"));
                //console.log(JSON.stringify(posts,null, "\t"))
            })            
        }
        else    
            throw err;
    });
    res.send({status: "ok", message: "Received."});    
}

module.exports.insertTrackingData = function(req, res)
{
    var post_data = req.body;

    var trackingData = new FingerprintTracking({
        userId: post_data.id,
        date:post_data.date,
        algoritm: post_data.algoritm,
        sensorData: post_data.sensorData,
        wlanMeasurement: post_data.wlanMeasurement
    });    

    trackingData.save(function (err){
        if(!err){
            FingerprintTracking.find({})
            .populate('userId')
            .exec(function(error, posts){
                res.end(JSON.stringify(posts,null, "\t"));
                //console.log(JSON.stringify(posts,null, "\t"))
            })            
        }
        else
            throw err;
    });
    res.send({status: "ok", message: "Received."});            
    
}

module.exports.testDataCls = function(req, res)
{
    var dateNow = new Date(); //2017-04-25T06:23:36.510Z
    
    var fingerPrintData = new Fingerprint({
        mapId: 'Test',
        mapFileName: 'TestFile',
        gridsSize: Math.random(),      
        X: Math.random(),
        Y: Math.random(),
        leftX: Math.random(),
        topY: Math.random(),
        rightX: Math.random(),
        bottomY: Math.random(),
        date: dateNow,
        wlanMeasurement: [
            {
                bssid:  '00:14:85:bc:3d:7c',
                ssid:  '00:14:85:bc:3d:7c',
                powerLevels:[Math.random(),Math.random(),Math.random()]
            },
            {
                bssid: '00:19:70:9e:37:e2',
                ssid: '00:19:70:9e:37:e2',
                powerLevels:[Math.random(),Math.random(),Math.random()]
            },
            {
                bssid: '00:1d:19:14:23:b9',
                ssid: '00:1d:19:14:23:b9',
                powerLevels:[Math.random(),Math.random(),Math.random()]
            },
            {
                bssid: '00:11:92:e9:dd:00',
                ssid: 'String' + Math.random,
                powerLevels:[Math.random(),Math.random(),Math.random()]
            }
        ]       
    });

    fingerPrintData.save(function (err){
        if(!err){
            Fingerprint.find({})
            .populate('bssid')
            .exec(function(error, posts){
                res.end(JSON.stringify(posts,null, "\t"));
                //console.log(JSON.stringify(posts,null, "\t"))
            })            
        }
        else
            throw err;
    });
    res.send({status: "ok", message: "Received."});
}

//TODO ip alınacak..
function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

/**
 * START USER METHODSS
 */
// CREATES A NEW USER
module.exports.createUser = function(req, res)
{
    User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(user);
    });
}
// RETURNS ALL THE USERS IN THE DATABASE
module.exports.getAllUsers = function(req, res)
{
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}
// GETS A SINGLE USER FROM THE DATABASE
module.exports.getUserById = function(req, res)
{
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
}
// DELETES A USER FROM THE DATABASE
module.exports.deleteUserById = function(req, res)
{
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });

}
// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
module.exports.updateUserById = function(req, res)
{
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
}
/**
 * END USER METHODSS
 */
