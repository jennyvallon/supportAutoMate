var config = require('./config'), //file that requires development or production env file    mongoose = require('mongoose');module.exports = function() {    var db = mongoose.connect(config.db.uri, //    config.db.options,        function(err, db) {            if(err){console.log(err);}        }    );     require('../app/models/user.server.model');    return db;  };