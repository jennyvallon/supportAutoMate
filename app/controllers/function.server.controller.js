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
