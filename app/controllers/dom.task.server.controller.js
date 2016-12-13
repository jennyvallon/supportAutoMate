var func=require("./selenium.helper.server.controller.js");

exports.createDownloadLink=function(url){//creates download link by overriding html--any url
    return document.write("<a id='clickMe' download href="+url+">click me</a>");
};

exports.findLargestJpeg=function(){
    var array=document.getElementsByTagName("a");
    var length= array.length;
    var lastLink=array[length-1];
    return lastLink;
};

exports.getFileName=function(url){
    var url=url.toString();
    var slashIndex=url.lastIndexOf("/")+1;
    var fileName=url.slice(slashIndex);
    return fileName;
};

