const fs = require('fs'); 

var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');
var repository = require('./repository');

console.log('KickOff' + new Date() + '-');
repository.createDb();

var counter = 0;

setInterval( function x(params) {

        console.log('Loop' + new Date() + '-');
        counter++;
    
        HB.getPrice(products.HepsiBurada, counter);
    return x;
}(), 24000);//5min