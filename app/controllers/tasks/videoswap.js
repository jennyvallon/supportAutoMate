//NECESSARY PARAMS
//newVideoURL
//oldVideoId
//ticketNum

//SELENIUM
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var controlRoom=require('../tools/controlRoom/func');
var func=require('../tools/toolAgnostic.func');
var fileDetailsForContentRecord=require('../tools/fileDetailsForContentRecords/func');
var manageTool=require('../tools/manageTool/func');
var goTo=require('../../controllers/config.controller');

module.exports=function(req,res,next){
    var logId=req.query.ticketNum;
    var currentlog=func.openLog(logId);
    var now=new Date();
    var key={
        title:"autoMate performing video swap for ticket #"+req.query.ticketNum, 
        description:"video swap request handled by autoMate on "+now
    }; 
    var browser=new selenium.Builder().forBrowser('chrome').build();
     
    func.log(logId, "autoMate is beginning your video swap the following parameters...");
    func.log(logId, "Ticket Number:"+ req.query.ticketNum);
    func.log(logId, "Content ID for video being swapped out: "+ req.query.oldVideoId);
    func.log(logId,"Source for new video asset: "+req.query.newVideoURL);
    func.log(logId,"Automated browser opened",true);
    
    browser.wait(function(){return func.downloadAsset(browser,req.query.newVideoURL,logId);}).
    then(browser.wait(function(){return fileDetailsForContentRecord.login(browser,req.query.oldVideoId,logId);})).
    then(browser.findElement(By.js(fileDetailsForContentRecord.findLargestJpeg)).click()).
    then(
        browser.getCurrentUrl().then(function(url){
            console.log(url);
            res.locals.thumbnail=func.getFileName(url);
            res.locals.video=func.getFileName(req.query.newVideoURL); 
            func.log(logId,"Storing file names...",true);
            func.log(logId,"Thumbnail file name: "+ res.locals.thumbnail);
            func.log(logId,"Video file name: "+ res.locals.video);

            browser.wait(function(){return func.downloadAsset(browser,url,logId);}).
            then(browser.wait(function(){return controlRoom.login(browser,logId);})).
            then(browser.wait(function(){return controlRoom.impersonateAdmin(browser,logId);})).
            then(browser.wait(function(){return controlRoom.mediaManager(browser,logId);})).
            then(browser.wait(function(){return controlRoom.uploadVideo(browser,res,req,key,logId);})).
            then(browser.wait(function(){return controlRoom.captureVideoID(browser,res,req,key,logId);}).
                then(function(id){

                    res.locals.newVideoID=id;
                    func.log(logId,"ID for new video content: "+ res.locals.newVideoID);

                    browser.wait(function(){return manageTool.login(browser,logId);}).
                    then(browser.wait(function(){return manageTool.enableSearchContent(browser,logId);})).
                    then(browser.wait(function(){return manageTool.search(browser,res,req,req.query.oldVideoId,logId);})).
                    then(browser.wait(function(){return manageTool.find.content(browser,req.query.oldVideoId,logId);})).
                    then(browser.wait(function(){return manageTool.readPopupDialogue(browser,logId);})).
                    then(browser.wait(function(){return manageTool.changeContentID(browser,res.locals.newVideoID,logId);})).
                    then(browser.wait(function(){return manageTool.save(browser,res,req,logId);})).
                    then(function(){
                        func.log(logId,"autoMate has completed this video swap",true);
                        func.log(logId,"This log was been archived and will be accessible via the following URL:");
                        func.log(logId,goTo.host+"logs?log="+logId);  
                        func.closeLog(currentlog);
                    });
                })
            );
        })
    );
    
    res.render('socket', {//happening asynchronously
        title: 'Video Swap for '+req.query.ticketNum
    });
};

