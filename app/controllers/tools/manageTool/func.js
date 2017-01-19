//MANAGE TOOL FUNC

var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var goTo=require('../../config.controller');
var func=require('../toolAgnostic.func'); 

exports.login=function(browser,logId){
    return new Promise(function (resolve){
        
        func.log(logId,"Going to ManageTool URL: "+goTo.manageTool.url);
        func.log(logId,"Attempting to bypass Gmail Login using the following credentials:");
        func.log(logId,"Username: "+ goTo.manageTool.username);
        func.log(logId,"Password: "+ goTo.manageTool.password);
        
        browser.get(goTo.manageTool.url);
        browser.findElement(By.id("login-google")).click();
        browser.findElement(By.id("Email")).sendKeys(goTo.manageTool.username);
        browser.findElement(By.id("next")).click(); 
        browser.wait(until.elementLocated(By.id("Passwd"))).then(function(pwinput){
            browser.wait(until.elementIsVisible(pwinput)).then(function(result){
                result.sendKeys(goTo.manageTool.password);
                browser.findElement(By.id("signIn")).click();
                func.log(logId,"Bypass successful");
                resolve(true);
            });   
        });
    });
};

exports.enableSearchContent=function(browser,logId){
    return new Promise(function (resolve){
        browser.findElement(By.id("searchcontent")).click();
        func.log(logId,"Checked off 'Content Search'");
        resolve(true);
    });
};

exports.search=function(browser,res,req,searchParam,logId){
    return new Promise(function (resolve){
        browser.findElement(By.id("srchbox")).sendKeys(searchParam,'\ue006');
        func.log(logId,"Searching for "+ searchParam);

        browser.wait(until.elementIsNotVisible(browser.findElement(By.id("loadimg"))),60000);
        func.log(logId,"Waiting...");
        resolve(true);
    });
    
};

exports.find={
    content:function(browser,contentID,logId){
        return new Promise(function (resolve){
            browser.findElement(By.css("[data-id='"+contentID.toString()+"'] > div.infdiv.content > span")).click().
            then(func.log(logId,"Found Entry"));
            resolve(true);
        });
    }  
};

exports.readPopupDialogue=function(browser){
    return new Promise(function (resolve){
        browser.switchTo().frame(browser.findElement(By.css("#jp > iframe")));
        resolve(true)
    });
};

exports.changeContentID=function(browser,newContentId,logId){
    return new Promise(function (resolve){
        browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).clear().then(function(){
            browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).sendKeys(newContentId);
            func.log(logId,"Changing content Id to "+ newContentId);
            resolve(true);
        }); 
    });
};

exports.save=function(browser,res,req,logId){
    return new Promise(function (resolve){
        browser.findElement(By.css("[onclick='save();']")).click();
        func.log(logId,"Clicked Save");

        browser.wait(until.stalenessOf(browser.findElement(By.css("[onclick='save();']")))).then(function(){

            browser.findElement(By.id("sql")).getText().then(function(text){
                func.log(logId,"Save successful. Returned script is:");
                func.log(logId,text);
                resolve(true);
            });
        }); 
    });
};