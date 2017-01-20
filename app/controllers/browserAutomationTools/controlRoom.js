//CONTROL ROOM FUNCTIONS

var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var func=require('./toolAgnostic.func');       
var goTo=require('../login.credentials'); 

var log=require('../allOtherMiddleware/logging');
 
 

//DATE PICKER IN ADD VIDEO DIALOGUE
//markup is specific to **this** date picker 
exports.calendarPickerHTML=function(dateObject){
    return '<td class=" " data-handler="selectDay" data-event="click" data-month='+dateObject.month+' data-year='+dateObject.year+'><a class="ui-state-default" href="#">'+dateObject.day+'</a></td>';
};

 
exports.login=function(browser,logId){
    return new Promise(function(resolve){
        browser.get(goTo.controlRoom.url);
            log.log(logId, "Logging into Control Room with the following credentials...",true);
        browser.findElement(By.id("username")).sendKeys(goTo.controlRoom.username);
            log.log(logId, "Username: "+ goTo.controlRoom.username);
        browser.findElement(By.id("password")).sendKeys(goTo.controlRoom.password);
            log.log(logId, "Password: "+ goTo.controlRoom.password);
        browser.findElement(By.css("input.form-control.btn")).click();
        browser.wait(until.elementLocated(By.linkText("Video Products"))).
        then(function(){
            log.log(logId, "Control Room login successful");
            browser.wait(browser.sleep(1000)).then(function(){
                resolve(true);
            });
            
        });
    });       
};

//will impersonate using Default Inform Impersonate account of Tamesha Mugin

exports.impersonateAdmin=function(browser,logId){
    return new Promise(function(resolve){
        log.log(logId, "Attempting admin impersonation using Partner Id: 22222");
        browser.wait(browser.sleep(1000)).
        then(function(){
            browser.findElement(By.id("lnkUsers")).click();
            browser.findElement(By.id("txtPartnerId")).sendKeys("22222");
            browser.findElement(By.id("btnSubmit")).click();
            browser.wait(until.elementLocated(By.css("[onclick='impersonate(9994);']"))).
            then(function(element){
                browser.wait(until.elementIsVisible(element)).
                then(function(){
                    browser.findElement(By.css("[onclick='impersonate(9994);']")).click();
                    log.log(logId, "Admin Impersonation Successful");
                    resolve(true)
                });
            });
        });
    });
};

exports.mediaManager=function(browser,logId){
    return new Promise(function(resolve){
        browser.wait(until.elementLocated((By.css("[title='Media Manager']")))).
        then(function(){
            browser.findElement(By.css("[title='Media Manager']")).click();
            log.log(logId, "Entering Control Room's Media Manager",true);
            resolve(true);
        });
    });
};


exports.captureVideoID = function (browser, res, req, key,logId) {
    log.log(logId, "Beginning capture process for new Video Id");
    log.log(logId, "This process may take several minutes");
    
    return new Promise(function search(resolve){
        browser.navigate().refresh();
        browser.sleep(2000);
        browser.findElement(By.id("ddlFilterBy")).click();
        browser.findElement(By.xpath("//*[@id='ddlFilterBy']/option[2]")).click();
        browser.sleep(2000);

        browser.findElement(By.id("showTop")).getAttribute("innerHTML").
        then(function(result){
            log.log(logId, "Still searching for content ID");

            if(result.indexOf(key.title)!==-1){
                var id=result.slice((result.indexOf(key.title)-43),(result.indexOf(key.title)-35));

                log.log(logId, "Video Id capture process has been successful",true);
                log.log(logId,"ID for new video content: "+ id);

                return resolve(id);
            }
            log.log(logId, "Attempt unsuccessful. Trying again...");
            search(resolve);
        }); 
    });
};

exports.uploadVideo=function(browser,res,req,key,logId){  
    return new Promise(function (resolve){
        var yesterdaysDate=func.yesterday();

        log.log(logId,"Attempting to upload video in Control Room with the following parameters...",true);

        browser.findElement(By.css("[onclick='javascript:uploadVideo();']")).click();
        browser.findElement(By.id("upVideoFile")).sendKeys(goTo.defaultDownloadPath+res.locals.video);
        browser.findElement(By.id("upThumbnailFile")).sendKeys(goTo.defaultDownloadPath+res.locals.thumbnail);
        browser.findElement(By.id("title")).sendKeys(key.title);
        browser.findElement(By.id("description")).sendKeys(key.description);
        browser.findElement(By.css("img.ui-datepicker-trigger")).click();

        log.log(logId,"Video Path: "+ goTo.defaultDownloadPath+res.locals.video);
        log.log(logId,"Thumbnail Path: "+ goTo.defaultDownloadPath+goTo.defaultDownloadPath+res.locals.thumbnail);
        log.log(logId,"Title: "+ key.title);
        log.log(logId,"Description: "+ key.description);
        log.log(logId,"Event Date: "+ yesterdaysDate.month+"/"+yesterdaysDate.day+"/"+yesterdaysDate.year); 

        browser.wait(until.elementLocated(By.linkText(yesterdaysDate.day)),5000).
        then(function(){
            browser.findElement(By.linkText(yesterdaysDate.day)).click();
            browser.findElement(By.css("[onclick='submitUploadForm(); return false;']")).click();

            log.log(logId,"Submitted video for upload");

            var uploadSuccessElement=browser.findElement(By.id("divSuccessMsg"));
            var msg="Files successfully uploaded!";


            //files are successfully loaded--wait for the message to show near top of page
            browser.wait(until.elementTextIs(uploadSuccessElement,msg),20000).
            then(function(){
                log.log(logId,msg);

                //click search videos link
                browser.findElement(By.linkText("Search Videos")).click();
                log.log(logId,"Entered Control Room's 'Search Video' Tab",true);
                var loader=browser.findElement(By.id("loading"));
                browser.wait(until.elementIsNotVisible(loader)); 
                resolve(true);
            });     
        });
    });
};