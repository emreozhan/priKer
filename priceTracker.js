const fs = require('fs'); 

var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');

//console.log(products);
console.log('KickOff' + new Date() + '-');

var counter = 0;
var priceList = new Map();
priceList.set("emre", "ozhan");

var n1="samsung";
var ob1 = {'pri': 123, 'oldPri': 111};

var map = new HashMap();
map.set(n1,ob1);

const sqlite3 = require('sqliite2').verbose()

var strr = JSON.stringify(map);

var hpp = JSON.parse(strr);
//hpp.get(n1);
fs.writeFile('data.txt', strr, function (err) { 
    if(err) { 
        console.log(err); 
    } 
        else{ 
            console.log("success"); 
        } 
}); 




/* 
setInterval(function () {
    console.log('KickOff' + new Date() + '-');
    counter++;

    HB.getPrice(products.HepsiBurada, priceList, counter);
  var abc= util.mapToJson(priceList);
  console.log(priceList);

}, 4000); */