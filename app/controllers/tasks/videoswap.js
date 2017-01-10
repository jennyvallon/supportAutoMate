//SELENIUM
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var controlRoom=require('../tools/controlRoom/func');
var func=require('../tools/toolAgnostic.func');
var fileDetailsForContentRecord=require('../tools/fileDetailsForContentRecords/func');
var manageTool=require('../tools/manageTool/func');

module.exports=function(req,res,next){
    var now=new Date();
    var key={
        title:"autoMate performing video swap22 for #"+req.query.ticketNum, 
        description:"video swap request handled by autoMate on "+now
    }; 
    var browser=new selenium.Builder().forBrowser('chrome').build();
    
    
    func.downloadAsset(browser,req.query.newVideoURL);//download video   
    
    fileDetailsForContentRecord.login(browser,req.query.oldVideoId);
    browser.findElement(By.js(fileDetailsForContentRecord.findLargestJpeg)).click();
    browser.getCurrentUrl().then(function(url){
        
        res.locals.thumbnail=func.getFileName(url);
        func.downloadAsset(browser,url);//download thumbnail
        res.locals.video=func.getFileName(req.query.newVideoURL);  
   
   
        controlRoom.login(browser);//login to cr
        controlRoom.impersonateAdmin(browser);//impersonate Tamesha
        controlRoom.mediaManager(browser);//go to Media manager
        controlRoom.uploadVideo(browser,res,req,key); //upload video
        
        browser.wait(function(){ 
            return controlRoom.captureVideoID(browser,res,req,key);
        }).then(function(result){
            console.log("SUCCESS2");
            res.locals.newVideoID=result;
            
            manageTool.login(browser);//login to manage tool
            manageTool.enableSearchContent(browser);//check search content box
            manageTool.search(browser,res,req,req.query.oldVideoId);//input search params
            manageTool.find.content(browser,req.query.oldVideoId);//find desired content
            manageTool.readPopupDialogue(browser); //enter popup dialogue    
            manageTool.changeContentID(browser,res.locals.newVideoID);//change content id of asset 
            manageTool.save(browser,res,req);//save and collect script 

            res.end();
        });  
    });
};

