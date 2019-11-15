const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var msg = require('./messageHelper');


function findTextAndReturnRemainder(target, variable) {
    var chopFront = target.substring(target.search(variable) + variable.length, target.length);
    chopFront = chopFront.replace(/ı/gi, "i");
    chopFront = chopFront.replace(/İ/gi, "i");
    chopFront = chopFront.replace(/c/gi, "c");
    chopFront = chopFront.replace(/Ç/gi, "c");
    chopFront = chopFront.replace(/ü/gi, "u");
    chopFront = chopFront.replace(/Ü/gi, "u");
    chopFront = chopFront.replace(/ş/gi, "s");
    chopFront = chopFront.replace(/Ş/gi, "s");
    chopFront = chopFront.replace(/Ğ/gi, "g");
    chopFront = chopFront.replace(/ğ/gi, "g");
    chopFront = chopFront.replace(/}]};/gi, "}]}");
    // console.log("__________________chopFront______"+ chopFront);
    var result = chopFront.substring(0, chopFront.search("widgetApp.subscribe"));
    return result;
}

module.exports = {

    getPrice: function (urlList, priceList, counter) {
//console.log(priceList);
if(counter%4==0)
msg.sendMessage(331002272,"I am alive !, Hello World!");


        if (urlList != null) {
            urlList.forEach(elem => {

                //console.log("elem: " + elem);
                request(elem, function (err, res, body) {
                    if (err) {
                        console.log("err: " + err);
                    }
                    else {

                        const arr = [];
                        let $ = cheerio.load(body);
                        //console.log($('.extra-discount-price').html()); //HB
                        var text = $($('script')).text();
                        //console.log("text"+text);

                        var findAndClean = findTextAndReturnRemainder(text, "var productModel =");
                        // console.log("findAndClean"+findAndClean);
                        var result = JSON.parse(findAndClean);
                        /* console.log("result"+result);*/
                        var productName = result.product.name;
                        var currentPrice = result.product.currentListing.currentPrice.value;
                        //var currentPrice = result.product.currentListing.originalPriceFormatted;
                       
                        var oldProduct = priceList.get(productName);

                        //curren 40
                        //ss  best: 50 last: 70
//https://developer.mozilla.org/tr/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
if(oldProduct){
    //product var
    
    if(oldProduct.lastPrice === currentPrice){
            //birşey yapma
    }else{
            //sil - güncelle
            var isBest = currentPrice < oldProduct.bestPrice;
            priceList.delete(productName);
            var priceListItem = {[productName] : {  'name': productName, 
                                                    'bestPrice': isBest ? currentPrice : oldProduct.bestPrice,
                                                    'lastPrice':currentPrice
                                                }};

            priceList.set(productName, priceListItem);
            //console.log(productName+"_Price:"+currentPrice +"_old:"+oldProduct);
        
            if(isBest){
                    msg.sendMessage(331002272,"Best "+oldProduct+" \r\n _NEW:"+productName+" \r\n "+currentPrice);
            }
    }

}else{
    var priceListItem = {[productName] : { 'name': productName , 'bestPrice': currentPrice, 'lastPrice':currentPrice}};
    priceList.set(productName, priceListItem);
    
    msg.sendMessage(331002272,"New:"+productName+" \r\n"+currentPrice);
}

var strr = JSON.stringify(priceList);
console.log(strr);
fs.writeFile('data.txt', strr, function (err) { 
    if(err) { 
        console.log(err); 
    } 
        else{ 
            console.log("success"); 
        } 
}); 


/* 
                        if(!oldProduct){
                            priceList.set(productName, currentPrice);
                            console.log(productName+"_Price:"+currentPrice +"_old:"+oldProduct);

                            msg.sendMessage(331002272,"New:"+productName+" \r\n"+currentPrice);
                        }else{

                            if(oldProduct === currentPrice){

                                //console.log("degisiklik yok");
                            }else{
                                priceList.delete(productName);
                                priceList.set(productName, currentPrice);
                                console.log(productName+"_Price:"+currentPrice +"_old:"+oldProduct);

                                msg.sendMessage(331002272,"CoU: "+oldProduct+" \r\n _NEW:"+productName+" \r\n "+currentPrice);
                            }
                        }

 */
                        //Dosyaya yaz
                        /*    console.log(arr.toString());
                        fs.writeFile('data.txt', arr, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("success");
                            }
                        }); */

                    }
                });
            });

        }
    }
}

/*
var reged = new RegExp('(?<=inStockDate"\:")(.*?)(?=\")').exec(text);
console.log("regex sonuc_:"+reged); */