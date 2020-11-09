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
            let $ = cheerio.load(body);

            try {
              var livePrice = $("div.price").text().trim();

              livePrice = Number(livePrice.substring(0, livePrice.search(",")));
            } catch {
              livePrice = Number(0);
            }

            PCU.checkBestPriceAndUpdate(
              "WebdenAl",
              productName,
              productUrl,
              livePrice
            );
          }
        });
      });
    }
  },
};
