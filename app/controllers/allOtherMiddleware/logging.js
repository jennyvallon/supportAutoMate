var goTo=require('../login.credentials'); 
var fs=require('fs');

exports.openLog=function(ticketNum){
    var fileName=ticketNum+".txt";
    var num=fs.openSync("./logs/"+fileName,"a");
    return num;
};

var log=function(ticketNum, message, param){
    var fileName=ticketNum+".txt";
    if(param){
        fs.appendFileSync("./logs/"+fileName,"\r\n\r\n"+new Date()+" ===> "+message+"\r\n");
    }else{fs.appendFileSync("./logs/"+fileName,new Date()+" ===> "+message+"\r\n");}
};
 
exports.log=log;

exports.closeLog=function(fd){
    fs.close(fd);
};

exports.serveLog=function(req,res){
    res.render('log',{
        splitter:config.splitter
    });
    //page-level js is updating <title>
    //socket-events are getting log file because it will preserve formatting  
};

var config={
    splitter:"?",
    url:function(logId){return goTo.host+"logs"+this.splitter+logId;}
};

exports.config=config;