const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mLabUSer:4107Tg06@ds251548.mlab.com:51548/heroku_m44slg7h', {useMongoClient: true});
//mongodb://heroku_m44slg7h:810amt4q75402njko211v217q2@ds251548.mlab.com:51548/heroku_m44slg7h', { useMongoClient: true});
//mongoose.connect('mongodb://localhost/IPS_Db', { useMongoClient: true});  