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
    var slashIndex=url.lastIndexOf("/")+1;//so that slash is not included
    var fileName=url.slice(slashIndex);
    return fileName;
};

exports.yesterday=function(){
    var date= new Date();
    var month=date.getMonth()+1.;
    var day=date.getDate()-1;//yesterday's date
    var year=date.getFullYear();
    var yesterdaysDate={month:month.toString(),day:day.toString(),year:year.toString()};
    
    return yesterdaysDate;
};

exports.calendarPickerHTML=function(dateObject){
return '<td class=" " data-handler="selectDay" data-event="click" data-month='+dateObject.month+' data-year='+dateObject.year+'><a class="ui-state-default" href="#">'+dateObject.day+'</a></td>';
};

//exports.daySelector=function(HTML){
//    var tdLinks=document.getElementsByTagName("td");
//  
//    for(i=0;i<tdLinks;0)
//};

exports.findSourceContentId=function(){
    var iframe=document.querySelector("#jp > iframe").contentDocument || document.querySelector("#jp > iframe").contentWindow.document;
    iframe.querySelector("#display > input[type='text']:nth-child(30)");
};