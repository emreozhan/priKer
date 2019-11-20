const fs = require('fs'); 

var HB = require('./hepsiburada');
var products = require('./productLinks');
var util = require('./Util');
var HashMap = require('hashmap');
var repository = require('./repository');


var port = process.env.PORT || 5000;

var http = require('http');
var fileSystem = require('fs');

var server = http.createServer(function(req, resp){
	fileSystem.readFile('./index.html', function(error, fileContent){
		if(error){
			resp.writeHead(500, {'Content-Type': 'text/plain'});
			resp.end('Error');
		}
		else{
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.write(fileContent);
			resp.end();
		}
	});
	
	


console.log('KickOff' + new Date() + '-');
repository.createDb();

var counter = 0;

setInterval( function x(params) {

        console.log('Loop' + new Date() + '-');
        counter++;
    
        HB.getPrice(products.HepsiBurada, counter);
    return x;
}(), 24000);//5min
});

server.listen(port);

