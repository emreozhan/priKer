const fs = require('fs'); 
var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');
var repository = require('./repository');
const express = require('express');
const app = express();

var port = process.env.PORT || 5000;
var period = 120000;
console.log(port);

const server = app.listen(port, () => {
    console.log(`Express running →(period:${period}) PORT ${server.address().port}`);
  });

console.log('KickOff' + new Date() + '-');
repository.createDb();

var counter = 0;
var exCount = 0;
setInterval( function x(params) {
        app.get('/', (req, res) => res.send('Hello World!:'+ counter ))

        HB.getPrice(products.HepsiBurada, counter, exCount);
        counter++;

    return x;
}(), period);//2min...
