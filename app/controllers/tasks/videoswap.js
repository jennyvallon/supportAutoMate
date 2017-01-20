//NECESSARY PARAMS
//newVideoURL
//oldVideoId
//ticketNum

//SELENIUM
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var controlRoom=require('../browserAutomationTools/controlRoom');
var func=require('../browserAutomationTools/toolAgnostic.func');
var fileDetailsForContentRecord=require('../browserAutomationTools/fileDetailsForContentRecords');
var manageTool=require('../browserAutomationTools/manageTool');
var goTo=require('../../controllers/login.credentials');

var log=require('../allOtherMiddleware/logging');
//var handleIt=require('../allOtherMiddleware/errorHandling');


module.exports=function(req,res,next){
    var logId=req.query.ticketNum;
    var currentlog=log.openLog(logId);
    var now=new Date();
    var key={
        title:"autoMate performing video swap30 for ticket #"+req.query.ticketNum, 
        description:"video swap request handled by autoMate on "+now
    }; 
    var browser=new selenium.Builder().forBrowser('chrome').build();
     
    log.log(logId, "autoMate is beginning your video swap the following parameters...");
    log.log(logId, "Ticket Number:"+ req.query.ticketNum);
    log.log(logId, "Content ID for video being swapped out: "+ req.query.oldVideoId);
    log.log(logId,"Source for new video asset: "+req.query.newVideoURL);
    log.log(logId,"Automated browser opened",true);
    
    browser.wait(function(){return func.downloadAsset(browser,req.query.newVideoURL,logId);}).
    then(browser.wait(function(){return fileDetailsForContentRecord.login(browser,req.query.oldVideoId,logId);})).
    then(browser.findElement(By.js(fileDetailsForContentRecord.findLargestJpeg)).click()).
    then(
        browser.getCurrentUrl().then(function(url){
            console.log(url);
            res.locals.thumbnail=func.getFileName(url);
            res.locals.video=func.getFileName(req.query.newVideoURL); 
            log.log(logId,"Storing file names...",true);
            log.log(logId,"Thumbnail file name: "+ res.locals.thumbnail);
            log.log(logId,"Video file name: "+ res.locals.video);

            browser.wait(function(){return func.downloadAsset(browser,url,logId);}).
            then(browser.wait(function(){return controlRoom.login(browser,logId);})).
            then(browser.wait(function(){return controlRoom.impersonateAdmin(browser,logId);})).
            then(browser.wait(function(){return controlRoom.mediaManager(browser,logId);})).
            then(browser.wait(function(){return controlRoom.uploadVideo(browser,res,req,key,logId);})).
            then(browser.wait(function(){return controlRoom.captureVideoID(browser,res,req,key,logId);}).
                then(function(id){

                    res.locals.newVideoID=id;
                    log.log(logId,"ID for new video content: "+ res.locals.newVideoID);

                    browser.wait(function(){return manageTool.login(browser,logId);}).
                    then(browser.wait(function(){return manageTool.enableSearchContent(browser,logId);})).
                    then(browser.wait(function(){return manageTool.search(browser,res,req,req.query.oldVideoId,logId);})).
                    then(browser.wait(function(){return manageTool.find.content(browser,req.query.oldVideoId,logId);})).
                    then(browser.wait(function(){return manageTool.readPopupDialogue(browser,logId);})).
                    then(browser.wait(function(){return manageTool.changeContentID(browser,res.locals.newVideoID,logId);})).
                    then(browser.wait(function(){return manageTool.save(browser,res,req,logId);})).
                    then(function(){
                        log.log(logId,"autoMate has completed this video swap",true);
                        log.log(logId,"This log was been archived and will be accessible via the following URL:");
                        log.log(logId,log.config.url(logId));  
                        log.closeLog(currentlog);
                    });
                })
            );
        })
    );
    
    res.render('socket', {//happening asynchronously
        title: 'Video Swap for '+req.query.ticketNum
    });
};

