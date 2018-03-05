var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const Fingerprint = require('../Models/WLANFingerprint');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/insertData', function(req, res){
    var post_data = req.body;

    Fingerprint.create({
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
    },
    function(err, fingerprint){
        if (err) return res.status(500).send("There was a problem insert training data`.");
        res.send({status: "ok", message: "InsertedData."});    
    });
});

module.exports = router;