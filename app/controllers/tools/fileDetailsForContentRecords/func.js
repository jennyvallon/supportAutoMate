//FILE DETAILS FOR CONTENT RECORDS FUNC


var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var goTo=require('../../config.controller');  
var func=require('../toolAgnostic.func'); 


var findLargestJpeg=function(){
    var array=document.getElementsByTagName("a");
    var length= array.length;
    var lastLink=array[length-1];
    return lastLink; 
};

exports.findLargestJpeg=findLargestJpeg;

exports.downloadVideoThumbnail=function(browser,videoID,res,req){
    this.login(browser,videoID);
    browser.findElement(By.js(findLargestJpeg)).click();
    browser.getCurrentUrl().then(function(url){
        var fileName=func.getFileName(url);
        func.downloadAsset(browser,url);
        res.locals.thumbnail=fileName;
        console.log("DOWNLOAD VIDEO THUMBNAIL"); //IT SHOWS
        console.log(res.locals);
        return res.locals.thumbnail;
    });
};

exports.login=function(browser,key){ //login and find 
    browser.get(goTo.fileDetailsForContentRecords);
    browser.findElement(By.name("contentid")).sendKeys(key);
    browser.findElement(By.css("input[type='submit']")).click();
};



