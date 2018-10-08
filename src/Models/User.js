var mongoose = require('mongoose');
mongoose.connect('mongodb://mLabUSer:4107Tg06@ds251548.mlab.com:51548/heroku_m44slg7h', { useMongoClient: true});

var UserSchema = new mongoose.Schema({  
  deviceId: String,
  ipAdress:String,
  token:String,
  date: Date
},{ collection: 'User'});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');