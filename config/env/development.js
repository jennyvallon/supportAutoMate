var sessionSecret='developmentSessionSecret';var uid = require('uid');var string= uid();var session = require('express-session');var FileStore = require('session-file-store')(session);module.exports = {    db:{        uri:'mongodb://208.82.115.80:27017/thugcreditreport'//connection to correct database for development env//        options:{//            user:user,//            pass:password//        }    },    sessionSecret: sessionSecret,    sessionOptions: {          store: new FileStore(),        saveUninitialized: false,        resave: true,        secret: sessionSecret,        unset:'destroy',        cookie: { secure: false },        genid: function(req){return string;}     },        };