var log=require("./logging");

exports.log=function(controller,logLoc){ 
    try{
        controller;
    }
    catch(err){//depending on the error throw a different message
        log.log(logLoc,"autoMate has encountered an error:");
        log.log(logLoc,err.name);
        log.log(logLoc,err.message);
    }
};