const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var msg = require('./messageHelper');
const Util = require('./Util.js');
const repository = require('./repository');
const sqlite3 = require('sqlite3').verbose();


function findTextAndReturnRemainder(target, variable) {
    var chopFront = target.substring(target.search(variable) + variable.length, target.length);
    chopFront = chopFront.substring(chopFront.search('"listings":') + 11, chopFront.search(',"currentListing":{'));

    chopFront = Util.escapeAsci(chopFront);

    return chopFront;
}

module.exports = {

    getPrice: function (urlList, counter, exCount) {
        if (counter % 15 == 0) {
            msg.sendMessage(331002272, "I am alive !, Hello World!");
            console.log(counter)
        }
        console.log( counter)

        if (urlList != null) {
            urlList.forEach(elem => {
                var productUrl = elem.url;
                var productName = elem.productName;

                    request(productUrl, function(err, res, body) {
                            if (err) {
                                console.log("err: " + err);
                            }
                            else {
                                const arr = [];
                                let $ = cheerio.load(body);
                                var text = $($('script')).text();
                                var findAndClean = findTextAndReturnRemainder(text, "var productModel =");
                                try {
                                    var result = JSON.parse(findAndClean)[0];

                                } catch (error) {
                                    console.log("Json parse problem");
                                    return;
                                }
                                var livePrice = result.sortPriceText;
                                livePrice = Number(livePrice.substr(0, livePrice.search(',')));
                                //var livePrice = result.product.currentListing.originalPriceFormatted;

                                let db = new sqlite3.Database('./db/priKer.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
                                    if (err) {
                                        console.error(err.message);
                                    }
/*                             console.log('GetProduct: '+productName);
 */                        });

                                var oldProduct;
                                db.get("SELECT productName, SourceSite, BestPrice, LastPrice, ProductLink FROM Product Where productName = ? ", [productName], function (err, row) {

                                    if (err) {
                                        throw err;
                                    }

                                    if (row) {
                                        oldProduct = {
                                            productName: row.productName,
                                            SourceSite: row.SourceSite,
                                            BestPrice: row.BestPrice,
                                            LastPrice: row.LastPrice,
                                            ProductLink: row.ProductLink
                                        };
                                    }

                                    var actualProduct = {
                                        productName: productName,
                                        BestPrice: oldProduct ? oldProduct.BestPrice : Number.MAX_VALUE,
                                        LastPrice: livePrice,
                                        ProductLink: productUrl
                                    };

                                    if (oldProduct) {
                                        console.log( productName + "---"+ livePrice);

                                        //product var
                                        if (oldProduct.LastPrice != livePrice) {
                                            //product guncelle
                                            var isBest = livePrice < oldProduct.BestPrice;

                                            if (isBest) {
                                                actualProduct.BestPrice = livePrice;
                                                msg.sendMessage(331002272, "\xE2\x9A\xA0 Discount \xE2\x80\xBC : " + actualProduct.productName + " \r\n New:" + actualProduct.BestPrice + " -- Old:" + oldProduct.BestPrice + "Dif: "+ (actualProduct.BestPrice-oldProduct.BestPrice);
                                            }
                                            repository.updateProductPrices(actualProduct)

                                        }
                                        //repository.insertPriceTrackLogData(productName,'HB',actualProduct.BestPrice,oldProduct.LastPrice,livePrice, elem.url);

                                    } else {
                                        //yeni product
                                        repository.insertProduct(productName, 'HB', livePrice, livePrice, productUrl);
                                        //repository.insertPriceTrackLogData(productName,'HB',livePrice,livePrice,livePrice, elem.url);
                                        msg.sendMessage(331002272, "\xE2\x9A\xA0 NEW Product \xE2\x80\xBC: " + productName + " \r\n Price: " + livePrice);

                                    }
                                    db.close;
                                    return arr;
                                });
                            }
                        });


            });

        }
    }
}

/*
var reged = new RegExp('(?<=inStockDate"\:")(.*?)(?=\")').exec(text);
console.log("regex sonuc_:"+reged); */


/* var priceListItem = {
    [productName]: {
        'name': productName,
        'bestPrice': isBest ? livePrice : oldProduct.bestPrice,
        'lastPrice': livePrice
    }
};
 */