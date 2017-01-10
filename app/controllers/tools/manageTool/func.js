//MANAGE TOOL FUNC

var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;

var goTo=require('../../config.controller');

exports.login=function(browser){
    browser.get(goTo.manageTool.url);
    browser.findElement(By.id("login-google")).click();
    browser.findElement(By.id("Email")).sendKeys(goTo.manageTool.username);
    browser.findElement(By.id("next")).click();
    browser.sleep(2000).then(function(){
        browser.wait(until.elementIsVisible(browser.findElement(By.id("Passwd"))),4000).then(function(pwinput){
            pwinput.sendKeys(goTo.manageTool.password);
            browser.findElement(By.id("signIn")).click(); 
        }); 
    }); 
    
};

exports.enableSearchContent=function(browser){
    browser.findElement(By.id("searchcontent")).click();
};

exports.search=function(browser,res,req,searchParam){
    browser.findElement(By.id("srchbox")).sendKeys(searchParam,'\ue006');
    browser.wait(until.elementIsNotVisible(browser.findElement(By.id("loadimg"))),60000);
};

exports.find={
    content:function(browser,contentID){
        browser.findElement(By.css("[data-id='"+contentID.toString()+"'] > div.infdiv.content > span")).click();
    }  
};

exports.readPopupDialogue=function(browser){
    browser.switchTo().frame(browser.findElement(By.css("#jp > iframe")));
};

exports.changeContentID=function(browser,newContentId){
    browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).clear().then(function(){
        browser.findElement(By.css("#display > input[type='text']:nth-child(30)")).sendKeys(newContentId);
    });              
};

exports.save=function(browser,res,req){
    browser.findElement(By.css("[onclick='save();']")).click();
    browser.wait(until.stalenessOf(browser.findElement(By.css("[onclick='save();']")))).then(function(){
        browser.findElement(By.id("sql")).getText().then(function(text){
            res.locals.script=text; 
        });
    });    
};