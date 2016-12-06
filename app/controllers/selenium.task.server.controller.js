//this file will house all tasks (assuming this file architecture can support that)
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;
var func= require('./helper.func.server.controller');
var dom= require('./dom.task.server.controller');



var delayedBrowserClose=function(browserInstance,time){
    setTimeout(function(){return browserInstance.close();},time);
};

var downloadVideo=function(browser,url){
    browser.get('localhost:4000');
    browser.executeScript(dom.createDownloadLink,url);
    browser.findElement(By.id('clickMe')).click(); 
};

exports.videoSwap=function(req,res,next){ 
    var browser=new selenium.Builder().forBrowser('chrome').build(); //each task will spin up it's own browser as appropriate
    downloadVideo(browser,req.query.newVideoURL);
    delayedBrowserClose(browser, 20000);
    res.end();
};