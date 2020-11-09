const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
var msg = require("./messageHelper");
const Util = require("./Util.js");
const repository = require("./repository");
const sqlite3 = require("sqlite3").verbose();
var PCU = require("./priceCheckUtil");

function findTextAndReturnRemainder(target, variable) {
  var chopFront = target.substring(
    target.search(variable) + variable.length,
    target.length
  );
  chopFront = chopFront.substring(
    chopFront.search('"listings":') + 11,
    chopFront.search(',"currentListing":{')
  );

  chopFront = Util.escapeAsci(chopFront);

  return chopFront;
}

module.exports = {
  getPrice: function (urlList, counter, exCount) {
    if (counter % 15 == 0) {
      //msg.sendMessage(331002272, "I am alive !, Hello World!");
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
            const arr = [];
            let $ = cheerio.load(body);
            var text = $($("script")).text();
            var findAndClean = findTextAndReturnRemainder(
              text,
              "var productModel ="
            );
            try {
              var result = JSON.parse(findAndClean)[0];
            } catch (error) {
              console.log("Json parse problem");
              return;
            }
            var livePrice = result.sortPriceText;
            livePrice = Number(livePrice.substr(0, livePrice.search(",")));

            PCU.checkBestPriceAndUpdate(productName, productUrl, livePrice);
          }
        });
      });
    }
  },
};
