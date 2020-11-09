var msg = require("./messageHelper");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
var msg = require("./messageHelper");
const Util = require("./Util.js");
const repository = require("./repository");
const sqlite3 = require("sqlite3").verbose();
const NOSTOCKPRICE = Number(99999999);
module.exports = {

  checkBestPriceAndUpdate: function (sourceSite, productName, productUrl, livePrice) {
    let db = new sqlite3.Database(
      "./db/priKer.sqlite3",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          console.error(err.message);
        }
      }
    );

    var oldProduct;
    db.get(
      "SELECT productName, SourceSite, BestPrice, LastPrice, ProductLink FROM Product Where productName = ? ",
      [productName],
      function (err, row) {
        if (err) {
          throw err;
        }

      
        if (row) {
          oldProduct = {
            productName: row.productName,
            SourceSite: row.SourceSite,
            BestPrice: row.BestPrice,
            LastPrice: row.LastPrice,
            ProductLink: row.ProductLink,
          };
        }

        var actualProduct = {
          productName: productName,
          BestPrice: oldProduct ? oldProduct.BestPrice : NOSTOCKPRICE,
          LastPrice: livePrice,
          ProductLink: productUrl,
        };

        if (oldProduct) {
          console.log(productName + "---" + livePrice);

          //product var
          if(livePrice == 0){
            livePrice = NOSTOCKPRICE;
            actualProduct.LastPrice = NOSTOCKPRICE;
            actualProduct.BestPrice = NOSTOCKPRICE;
          }
          if (oldProduct.LastPrice != livePrice) {
            //product guncelle
            var isBest = livePrice < oldProduct.BestPrice;

            if (isBest) {
              actualProduct.BestPrice = livePrice;
              msg.sendMessage(
                331002272,
                "\xE2\x9A\xA0 Discount \xE2\x80\xBC : " +
                  actualProduct.productName +
                  " \r\n New:" +
                  actualProduct.BestPrice +
                  " -- Old:" +
                  oldProduct.BestPrice +
                  "  Dif: " +
                  (actualProduct.BestPrice - oldProduct.BestPrice)
              );
            }
            repository.updateProductPrices(actualProduct);
          }
          //repository.insertPriceTrackLogData(productName,'HB',actualProduct.BestPrice,oldProduct.LastPrice,livePrice, elem.url);
        } else {
          //yeni product
          repository.insertProduct(
            productName,
            sourceSite,
            livePrice,
            livePrice,
            productUrl
          );
          //repository.insertPriceTrackLogData(productName,'HB',livePrice,livePrice,livePrice, elem.url);
          msg.sendMessage(
            331002272,
            "\xE2\x9A\xA0 NEW Product \xE2\x80\xBC: " +
              productName +
              " \r\n Price: " +
              livePrice
          );
        }
        db.close;
        return;
      }
    );
  },
};
