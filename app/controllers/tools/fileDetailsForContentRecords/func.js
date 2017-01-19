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

exports.downloadVideoThumbnail=function(browser,videoID,res,req,logId){ 
    return new Promise(function (resolve){
        this.login(browser,videoID);
        browser.findElement(By.js(findLargestJpeg)).click();
        browser.getCurrentUrl().then(function(url){
            var fileName=func.getFileName(url);
            func.downloadAsset(browser,url);
            resolve(fileName);
        });
    });
};

exports.login=function(browser,key,logId){ //login and find 
    return new Promise(function (resolve){
        func.log(logId,"Logging in to File Details for Content Records with the following parameters...",true);
        func.log(logId,"URL: "+goTo.fileDetailsForContentRecords);
        func.log(logId,"Searching for: "+key);

        browser.get(goTo.fileDetailsForContentRecords);
        browser.findElement(By.name("contentid")).sendKeys(key);
        browser.findElement(By.css("input[type='submit']")).click();
        resolve(true);
    });
};



