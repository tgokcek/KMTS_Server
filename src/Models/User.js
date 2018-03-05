var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  deviceId: String,
  ipAdress:String,
  token:String,
  date: Date
},{ collection: 'User'});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');