const fs = require('fs'); 
var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');
var repository = require('./repository');
const express = require('express');
const app = express();

var port = process.env.PORT || 5000;
console.log(port);

const server = app.listen(port, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });

console.log('KickOff' + new Date() + '-');
repository.createDb();

var counter = 0;

setInterval( function x(params) {

/*         console.log('Loop' + new Date() + '-');
 */     counter++;
        app.get('/', (req, res) => res.send('Hello World!:'+ counter ))

        HB.getPrice(products.HepsiBurada, counter);
    return x;
}(), 500001);//5min...
