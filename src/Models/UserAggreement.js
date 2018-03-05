const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

var userScheme = new Scheme({
    userId: String,
    date: {type: Date, default: Date.now}

},{ collection: 'TrackingUser'});

var USER = mongoose.model('USER', userScheme);

module.exports = USER;