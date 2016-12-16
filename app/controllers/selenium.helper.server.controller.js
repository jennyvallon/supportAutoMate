//
////
//////RESUABLE HELPER FUNCTIONS LEVERAGING SELENIUM WEBDRIVER 
////
//

//selenium webdriver modules
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var dom= require('./dom.task.server.controller');//javascript browser func
var goTo=require('../../config/links');//tool logins




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

var delayedBrowserClose=function(browserInstance,time){
    setTimeout(function(){return browserInstance.close();},time);
};

exports.findInHTML=function(instance,HTML){
    var promise=instance.executeScript((function(){
            var pageHTML=document.getElementsByTagName('html').innerHTML;
            if(findString(pageHTML,HTML)){
                return true;
            } 
            else{
                console.log('Still searching for '+HTML);
            }
        }),HTML);
    return promise;
};

exports.downloadAsset=function(browser,url){ // downloads file passed in passed browser instance 
    browser.get(goTo.host);
    browser.executeScript(dom.createDownloadLink,url);
    browser.findElement(By.id('clickMe')).click(); 
};

exports.findVideo=function(browser,videoTitle){
    var vidName=videoTitle;
    var promise= browser.executeScript(function(vidName){
            var now= new Date();
            var labels=document.getElementsByTagName("label");
            for(i=0;i<labels.length;i++){
                if(labels[i].innerText===vidName){
                    var vidid=labels[i].parentElement.parentElement.id;
                    console.log("FOUND");
                    console.log(now+" Found video titled "+ vidName);
                    console.log("ID is "+vidid);
                    return vidid;
                }
            } 
        },vidName);
    return promise;
};