const mongoose = require('mongoose');
const Scheme = mongoose.Schema;


var wlanMeasurementScheme = new Scheme({
    bssid: String,
    ssid: String,
    powerLevels:[Number]
});

var  WlanMeasurement = mongoose.model('WlanMeasurement',wlanMeasurementScheme);



var wlanFingerprintScheme = new Scheme({
    mapId: String,
    mapFileName: String,
    gridsSize: String,
    X: Number,
    Y: Number,
    leftX: Number,
    topY: Number,
    rightX: Number,
    bottomY: Number,
    date: {type: Date, default: Date.now},
    wlanMeasurement:  [{type: wlanMeasurementScheme}]

},{ collection: 'WLANTrainingData', autoCreate:true});

//const wlanFingerprint = mongoose.model('wlanFingerprint', wlanFingerprintScheme);

// Create the model class
var WLANTraining = mongoose.model('WLANTraining', wlanFingerprintScheme);

// Export the model
module.exports = WLANTraining;
//module.exports.wlanMeasurement = WlanMeasurement;

module.exports.getAverage = function(bssid, x, y){   
    WLAN.aggregate()
    .match({ "wlanMeasurement.bssid" : bssid })
    .average('powerLevels');

    console.log('getAverage');
}