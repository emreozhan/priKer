const fs = require('fs'); 

var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');
var repository = require('./repository');

console.log('KickOff' + new Date() + '-');
repository.createDb();

var counter = 0;
/* 
setInterval(function () { */
    console.log('KickOff' + new Date() + '-');
    counter++;

    HB.getPrice(products.HepsiBurada, counter);

/* }, 10000); */