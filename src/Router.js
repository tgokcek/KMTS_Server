var express = require('express');
var DBOrg = require('./controller/DbOrganizer');

//var router = express.Router();

module.exports = function(app){
    app.get('/', function(req, res){
        //res.send({message:'Tuncay GOKCEK'});
        DBOrg.testDataCls(req, res);
        //DBOrg.openDBConnection(req, res);
        //DB.openDBConnection;
    });   
    app.get('/alllist', function(req, res){
        //res.send({message:'All List'});
        DBOrg.getLevels(req, res);
    }); 
    app.get('/getBSSID',function(req, res){
        var bssids={"wlanMeasurement":[{"bssid": "00","poverLevel": "-15"},{"bssid": "01","poverLevel": "-15"}]};
        console.log(bssids);
        DBOrg.getWLANFingerprintWithBSSID(bssids);

    });
    /*app.post('/trainingData', function(req, res){
        //res.send({message:'trainingData'});
        DBOrg.insertTrainingData(req, res);
    });*/
    app.post('/trackingData', function(req, res){
        DBOrg.insertTrackingData(req, res);        
        var post_data = req.body;
        console.log(post_data);
        //res.send({message:'trainingData'});
       // DBOrg.insertTrainingData
    });
    app.post('/registrationData', function(req, res){
        DBOrg.insertAggremenData(req, res);
        var post_data = req.body;
        console.log(post_data);
        //res.send({message:'trainingData'});
        //res.sendStatus(200);        
       // DBOrg.insertTrainingData
    });
    app.post('/createUser', function(req, res){
        DBOrg.insertAggremenData(req, res);
        var post_data = req.body;
        console.log(post_data);
        //res.send({message:'trainingData'});
        //res.sendStatus(200);        
       // DBOrg.insertTrainingData
    });
}