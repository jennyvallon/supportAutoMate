//TOOL AGNOSTIC FUNC
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var goTo=require('../config.controller'); 

var fs=require('fs');



var createDownloadLink=function(url){//creates download link by overriding html--any url
    return document.write("<a id='clickMe' download href="+url+">click me</a>");
};

exports.createDownloadLink=createDownloadLink;

exports.yesterday=function(){
    var date= new Date(); 
    var month=date.getMonth()+1.;
    var day=date.getDate()-1;//yesterday's date
    var year=date.getFullYear();
    var yesterdaysDate={month:month.toString(),day:day.toString(),year:year.toString()};
    
    return yesterdaysDate;
};

//returns boolean
exports.findString=function(contentToSearch,stringToFind){ 
    if(contentToSearch.indexOf(stringToFind)> -1){
        return true;
    }else {return false;}
};

//returns substring between two known strings, e.g. html elements
exports.returnString=function(contentToSearch,leftStringContent,rightStringContent){
    var start= contentToSearch.search(leftStringContent);
    var end= contentToSearch.search(rightStringContent);
    var result=contentToSearch.substring(start,end);
    
    return result;
};
  
exports.downloadAsset=function(browser,assetUrl,logId){ // downloads file passed in passed browser instance 
    return new Promise(function (resolve){
        browser.get(goTo.host);
        browser.executeScript(createDownloadLink,assetUrl);
        browser.findElement(By.id('clickMe')).click(); 
        log(logId,"Asset downloaded from the following location: "+ assetUrl, true);
        resolve(true);
    });
};

exports.getFileName=function(url){
    var URL=url.toString();
    var slashIndex=URL.lastIndexOf("/")+1;//so that slash is not included
    var fileName=URL.slice(slashIndex);
    return fileName;
};

exports.uniqueNumberFunction = (function() {
    var i = 0;
    return function() {
        return i++;
    };
})(); 

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
    res.render('log',{});
    //page-level js is updating <title>
    //socket-events are getting log file because it will preserve formatting
    
};



