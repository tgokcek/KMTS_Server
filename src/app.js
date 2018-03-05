var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var UserController = require(__root + 'Controller/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'Controller/AuthController');
app.use('/api/auth', AuthController);

var TrainingController = require(__root + 'Controller/TrainingController');
app.use('/api/training', TrainingController);

var TrackingController = require(__root + 'Controller/TrackingController');
app.use('/api/tracking', TrackingController);


module.exports = app;