const Fingerprint = require('../Models/WLANFingerprint');

const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

var wlanScheme = new Scheme({
    bssid: String,
    ssid: String,
    powerLevels:[Number]
});

var WlanLevelMeasurement = mongoose.model('WlanLevelMeasurement',wlanScheme);

var sensorScheme = new Scheme({
    stepCount: String,
    stepLength: String,
    distance: String,
    time: {type: Date, default: Date.now},
    yaw: String,
    pitch: String,
    roll: String
});

var  SensorData = mongoose.model('SensorData',sensorScheme);


var wlanTrackingFingerprintScheme = new Scheme({
    userId: String,
    algoritm: String,
    date: {type: Date, default: Date.now},
    sensorData:  {type: sensorScheme},
    wlanMeasurement:  [{type: wlanScheme}]
},{ collection: 'FingerprintTrackingData'});

var wlanTrackingFingerprint = mongoose.model('wlanTrackingFingerprint', wlanTrackingFingerprintScheme);

module.exports = wlanTrackingFingerprint;