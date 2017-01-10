//CONTROL ROOM FUNCTIONS

var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var func=require('../toolAgnostic.func');       
var goTo=require('../../config.controller'); 
 
 

//DATE PICKER IN ADD VIDEO DIALOGUE
//markup is specific to **this** date picker 
exports.calendarPickerHTML=function(dateObject){
return '<td class=" " data-handler="selectDay" data-event="click" data-month='+dateObject.month+' data-year='+dateObject.year+'><a class="ui-state-default" href="#">'+dateObject.day+'</a></td>';
};

//FIND VIDEO IN https://control.inform.com/Search
//Will log message in console if accessed


exports.login=function(browser){
    browser.get(goTo.controlRoom.url);
    browser.findElement(By.id("username")).sendKeys(goTo.controlRoom.username);
    browser.findElement(By.id("password")).sendKeys(goTo.controlRoom.password);
    browser.findElement(By.css("input.form-control.btn")).click().
            then(function(){browser.sleep(3000);});
};

//will impersonate using Default Inform Impersonate account of Tamesha Mugin

exports.impersonateAdmin=function(browser){
    var loader = browser.findElement(By.id("loading"));
    browser.wait(until.elementIsNotVisible(loader),2000).then(function(){
        browser.findElement(By.id("lnkUsers")).click();
        browser.findElement(By.id("txtPartnerId")).sendKeys("22222");
        browser.findElement(By.id("btnSubmit")).click().
            then(function(){browser.sleep(4000);});
        browser.findElement(By.css("[onclick='impersonate(9994);']")).click().
            then(function(){browser.sleep(3000);}); 
    });
    
};

exports.mediaManager=function(browser){
    browser.findElement(By.css("[title='Media Manager']")).click().
            then(function(){browser.sleep(2000);});
};


exports.captureVideoID = function (browser, res, req, key) {
return new Promise(function poop(resolve){
        browser.navigate().refresh();
        browser.sleep(2000);
        browser.findElement(By.id("ddlFilterBy")).click();
        browser.findElement(By.xpath("//*[@id='ddlFilterBy']/option[2]")).click();
        browser.sleep(2000);

        browser.findElement(By.id("showTop")).getAttribute("innerHTML").then(function(result){
            console.log(result);
            if(result.indexOf(key.title)!==-1){
                console.log("SUCCESS");
                var id=result.slice((result.indexOf(key.title)-43),(result.indexOf(key.title)-35));
                return resolve(id);
            }
            poop(resolve);
        }); 
    });
};

exports.uploadVideo=function(browser,res,req,key){    
    var yesterdaysDate=func.yesterday(); 
    browser.findElement(By.css("[onclick='javascript:uploadVideo();']")).click();
    
    browser.findElement(By.id("upVideoFile")).sendKeys(goTo.defaultDownloadPath+res.locals.video);
    browser.findElement(By.id("upThumbnailFile")).sendKeys(goTo.defaultDownloadPath+res.locals.thumbnail); 
    
    browser.findElement(By.id("title")).sendKeys(key.title);
    browser.findElement(By.id("description")).sendKeys(key.description);
    browser.findElement(By.css("img.ui-datepicker-trigger")).click();
    browser.wait(until.elementLocated(By.linkText(yesterdaysDate.day)),5000).then(function(){
        browser.findElement(By.linkText(yesterdaysDate.day)).click();
        //click upload
        browser.findElement(By.css("[onclick='submitUploadForm(); return false;']")).click();
        var uploadSuccessElement=browser.findElement(By.id("divSuccessMsg"));
        var msg="Files successfully uploaded!";
        //files are successfully loaded
        browser.wait(until.elementTextIs(uploadSuccessElement,msg),200000).then(function(){
            //click search videos link
            browser.findElement(By.linkText("Search Videos")).click();
            var loader=browser.findElement(By.id("loading"));
            browser.wait(until.elementIsNotVisible(loader));
        }); 
    });
};