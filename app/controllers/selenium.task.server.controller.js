//this file will house all tasks (assuming this file architecture can support that)
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var help= require('./selenium.helper.server.controller');
var dom= require('./dom.task.server.controller');
var goTo=require('../../config/links');
var path=require('../../config/fileLocation');








var uploadVideoToControlRoom=function(browser,res,req){
    var now=new Date();
    var key={title:"autoMate VideoSwap for #"+req.query.ticketNum,description:"video swap request handled by autoMate on "+now};
    var yesterdaysDate=dom.yesterday();
    browser.get(goTo.controlRoom.url);
    browser.findElement(By.id("username")).sendKeys(goTo.controlRoom.username);
    browser.findElement(By.id("password")).sendKeys(goTo.controlRoom.password);
    browser.findElement(By.css("input.form-control.btn")).click().
            then(function(){browser.sleep(3000);});
    browser.findElement(By.id("lnkUsers")).click();
    browser.findElement(By.id("txtPartnerId")).sendKeys("22222");
    browser.findElement(By.id("btnSubmit")).click().
            then(function(){browser.sleep(4000);});
    browser.findElement(By.css("[onclick='impersonate(9994);']")).click().
            then(function(){browser.sleep(3000);});
    browser.findElement(By.css("[title='Media Manager']")).click().
            then(function(){browser.sleep(2000);});
    browser.findElement(By.css("[onclick='javascript:uploadVideo();']")).click();
    browser.findElement(By.id("upVideoFile")).sendKeys(path.downloads+res.locals.video);
    browser.findElement(By.id("upThumbnailFile")).sendKeys(path.downloads+res.locals.thumbnail);
    browser.findElement(By.id("title")).sendKeys(key.title);
    browser.findElement(By.id("description")).sendKeys(key.description);
    browser.findElement(By.css("img.ui-datepicker-trigger")).click();
    //filling out add video form
    browser.wait(until.elementLocated(By.linkText(yesterdaysDate.day)),5000).then(function(){
        browser.findElement(By.linkText(yesterdaysDate.day)).click();
        //click upload
        browser.findElement(By.css("[onclick='submitUploadForm(); return false;']")).click();
        var uploadSuccessElement=browser.findElement(By.id("divSuccessMsg"));
        var msg="Files successfully uploaded!";
        browser.wait(until.elementTextIs(uploadSuccessElement,msg),200000).then(function(){
            //click search videos link
            browser.findElement(By.linkText("Search Videos")).click();
            var loader=browser.findElement(By.id("loading"));
            browser.wait(until.elementIsNotVisible(loader)).then(function(){
                //refresh click "my videos" dropdown and wait until video is found;
                browser.findElement(By.id("ddlFilterBy")).click();
                browser.findElement(By.xpath("//*[@id='ddlFilterBy']/option[2]")).click();
                browser.wait(until.elementIsNotVisible(loader)).then(function(){
                    browser.wait(help.findVideo(browser,key.title)).then(function(result){
                    console.log(result);
                    if(typeof result==="string"){
                        res.locals.newVideoID=result;
                        console.log("VIDEO FOUND");
                        console.log(res.locals);
                        swapIds(browser,res,req);
                    }else{console.log("shit");}
                });
                });
            });
        });
    });
};

var swapIds=function(browser,res,req){
    browser.get(goTo.manageTool.url);
    browser.findElement(By.id("login-google")).click();
    browser.findElement(By.id("Email")).sendKeys(goTo.manageTool.username);
    browser.findElement(By.id("next")).click();
    browser.sleep(2000).then(function(){
        browser.wait(until.elementIsVisible(browser.findElement(By.id("Passwd"))),4000).then(function(pwinput){
            pwinput.sendKeys(goTo.manageTool.password);
        }); 
    }); 
    browser.findElement(By.id("signIn")).click();
    browser.findElement(By.id("searchcontent")).click();
    browser.findElement(By.id("srchbox")).sendKeys(req.query.oldVideoId,'\ue006');
    browser.wait(until.elementIsNotVisible(browser.findElement(By.id("loadimg"))),60000).then(function(){
        browser.findElement(By.css("[data-id='"+req.query.oldVideoId.toString()+"'] > div.infdiv.content > span")).click();
        browser.switchTo().frame(browser.findElement(By.css("#jp > iframe"))).then(function(){
            browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).clear().then(function(){
                browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).sendKeys(res.locals.newVideoID);
                browser.findElement(By.css("[onclick='save();']")).click();
                browser.wait(until.stalenessOf(browser.findElement(By.css("[onclick='save();']")))).then(function(){
                    browser.findElement(By.id("sql")).getText().then(function(text){
                        res.locals.script=text;
                        console.log(res.locals);
                    });
                });    
            });
        });   
    });
};

var downloadVideoThumbnail=function(browser,videoID,res,req){
    browser.get(goTo.fileDetailsForContentRecords);
    browser.findElement(By.name("contentid")).sendKeys(videoID);
    browser.findElement(By.css("input[type='submit']")).click();
    browser.findElement(By.js(dom.findLargestJpeg)).click();
    var getCurrentURL=browser.getCurrentUrl();
    getCurrentURL.then(function(url){
        var fileName=dom.getFileName(url);
        res.locals.thumbnail=fileName;
        help.downloadAsset(browser,url);
        uploadVideoToControlRoom(browser,res,req); 
    });
    
};


exports.videoSwap=function(req,res,next){
    var browser1=new selenium.Builder().forBrowser('chrome').build(); //each task will spin up it's own browser as appropriate
    var fileName=dom.getFileName(req.query.newVideoURL);
    res.locals.video=fileName;
    help.downloadAsset(browser1,req.query.newVideoURL);
    downloadVideoThumbnail(browser1,req.query.oldVideoId,res,req);
    res.end();
};