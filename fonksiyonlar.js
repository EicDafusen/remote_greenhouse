
var months = ["January", "February", "March", "April", "May", "June", "July",
         "August", "September", "October", "November", "December"];

var getTimeStamp = function(now){
         
    var Stamp = now.getDate()+"-"+months[now.getMonth()]+"-"+now.getFullYear()+"   "+now.getHours()+":"+now.getMinutes()
     return  Stamp;
} 

module.exports = {
     getTimeStamp
}
