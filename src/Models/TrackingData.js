const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

var TrackingDataScheme = new Scheme({
    distance: Number,
    matchedBssids: Number,
    date: {type: Date, default: Date.now},
    userId : String,
    fingerprintTrainingId: { type: mongoose.Schema.Types.ObjectId}
});  

//var TrackingData = mongoose.model('TrackingData', TrackingDataScheme);

module.exports = function addTrackingData(collectionName){    
    var str = `${collectionName}`;
    return mongoose.model('TrackingData', TrackingDataScheme, str);
}
