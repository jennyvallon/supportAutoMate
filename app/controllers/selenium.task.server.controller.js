//this file will house all tasks (assuming this file architecture can support that)
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var help= require('./selenium.helper.server.controller');
var dom= require('./dom.task.server.controller');
var goTo=require('../../config/links');
var path=require('../../config/fileLocation');





var uploadVideoToControlRoom=function(browser,res){
    browser.get(goTo.controlRoom.url);
    browser.findElement(By.id("username")).sendKeys(goTo.controlRoom.username);
    browser.findElement(By.id("password")).sendKeys(goTo.controlRoom.password);
    browser.findElement(By.css("input.form-control.btn")).click().
            then(function(){browser.sleep(3000);});
    browser.findElement(By.id("lnkUsers")).click();
    browser.findElement(By.id("txtPartnerId")).sendKeys("22222");
    browser.findElement(By.id("btnSubmit")).click().
            then(function(){browser.sleep(2000);});
    browser.findElement(By.css("[onclick='impersonate(9994);']")).click().
            then(function(){browser.sleep(3000);});
    browser.findElement(By.css("[title='Media Manager']")).click().
            then(function(){browser.sleep(2000);});
    browser.findElement(By.css("[onclick='javascript:uploadVideo();']")).click();
    browser.findElement(By.id("upVideoFile")).sendKeys(path.downloads+res.locals.video);
    browser.findElement(By.id("upThumbnailFile")).sendKeys(path.downloads+res.locals.thumbnail);
    
};



var downloadVideoThumbnail=function(browser,videoID,res){
    browser.get(goTo.fileDetailsForContentRecords);
    browser.findElement(By.name("contentid")).sendKeys(videoID);
    browser.findElement(By.css("input[type='submit']")).click();
    browser.findElement(By.js(dom.findLargestJpeg)).click();
    var getCurrentURL=browser.getCurrentUrl();
    getCurrentURL.then(function(url){
        var fileName=dom.getFileName(url);
        res.locals.thumbnail=fileName;
        help.downloadAsset(browser,url);
        uploadVideoToControlRoom(browser,res); 
    });
    
};


exports.videoSwap=function(req,res,next){
    var browser1=new selenium.Builder().forBrowser('chrome').build(); //each task will spin up it's own browser as appropriate
    var fileName=dom.getFileName(req.query.newVideoURL);
    res.locals.video=fileName;
    help.downloadAsset(browser1,req.query.newVideoURL);
    downloadVideoThumbnail(browser1,req.query.oldVideoId,res);
    
    res.end();
};