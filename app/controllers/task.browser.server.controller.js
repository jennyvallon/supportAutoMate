//this file will house all tasks (assuming this file architecture can support that)
var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;
var func= require('./function.server.controller');

exports.test=function(req,res,next){ 
    var driver=new selenium.Builder().forBrowser('chrome').build(); //each task will spin up it's own browser as appropriate
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('wiki');
    driver.findElement(By.name('btnG')).click();
    driver.wait(func.checkTitle,10000);
    func.checkTitle(driver);
    res.end();
};