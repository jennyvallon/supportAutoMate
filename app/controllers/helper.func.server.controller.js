var selenium =require('selenium-webdriver');
var By =require('selenium-webdriver').By;
var until =require('selenium-webdriver').until;
var dom= require('./dom.task.server.controller');

exports.checkTitle=function(instance){
    var promise=instance.getTitle().then(function(title){
        if(title==='wiki - Google Search')
        {
            console.log('success');
            return true;
        }
        else
        {
            console.log('fail -- '+ title);
        }
    });
    return promise;
};





