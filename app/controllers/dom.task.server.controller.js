exports.createDownloadLink=function(url){
    return document.write("<a id='clickMe' download href="+url+">click me</a>");
};