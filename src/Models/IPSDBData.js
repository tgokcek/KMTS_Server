const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

var IPSDataScheme = new Scheme({
    name: String,
    location: String,
    layout: String,
    date: String,
    time: String,
    algorithm:String
});  

//var TrackingData = mongoose.model('TrackingData', TrackingDataScheme);

module.exports = function addTrackingData(collectionName){    
    var str = `${collectionName}`;
    return mongoose.model('IPSTrackingData', IPSDataScheme, str);
}
