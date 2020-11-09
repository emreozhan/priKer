const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
var msg = require("../messageHelper");
const Util = require("../Util.js");
const repository = require("../repository");
const sqlite3 = require("sqlite3").verbose();
var PCU = require("../priceCheckUtil");

module.exports = {
  getPrice: function (urlList, counter, exCount) {
    if (counter % 15 == 0) {
      console.log(counter);
    }
    console.log(counter);

    if (urlList != null) {
      urlList.forEach((elem) => {
        var productUrl = elem.url;
        var productName = elem.productName;

        request(productUrl, function (err, res, body) {
          if (err) {
            console.log("err: " + err);
          } else {
            /**INFO Change Here */

            let $ = cheerio.load(body);

            try {
              var livePrice = $("#buyNewSection > div > div > span > span")[0]
                .firstChild.data;
              livePrice = livePrice.replace(",", ".");
              livePrice = Number(livePrice.substr(1, livePrice.length - 3));
            } catch {
              livePrice = Number(0);
            }
            PCU.checkBestPriceAndUpdate(
              "amazonTr",
              productName,
              productUrl,
              livePrice
            );

            /**INFO Change Here */
          }
        });
      });
    }
  },
};
