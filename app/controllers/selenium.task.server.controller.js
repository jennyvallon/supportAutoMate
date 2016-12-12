//this file will house all tasks (assuming this file architecture can support that)
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var help= require('./selenium.helper.server.controller');
var dom= require('./dom.task.server.controller');
var goTo=require('../../config/links');





var uploadVideoToControlRoom=function(browser){
    browser.get(goTo.controlRoom);
};



var downloadVideoThumbnail=function(browser,videoID){
    var title="NDN Internal Monitoring Stats";
    var heading="Everything You Ever Wanted to Know About a Content Record";
    browser.get(goTo.fileDetailsForContentRecords);
    browser.findElement(By.name("contentid")).sendKeys(videoID);
    browser.findElement(By.css("input[type='submit']")).click();
    browser.findElement(By.js(dom.findLargestJpeg)).click();
    var jpegURL=browser.getCurrentUrl();
    help.downloadAsset(browser,jpegURL);
};


exports.videoSwap=function(req,res,next){ 
    var browser1=new selenium.Builder().forBrowser('chrome').build(); //each task will spin up it's own browser as appropriate
    help.downloadAsset(browser1,req.query.newVideoURL);
    downloadVideoThumbnail(browser1,req.query.oldVideoId);
    uploadVideoToControlRoom(browser1);
    res.end();
};