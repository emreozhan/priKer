const sqlite3 = require('sqlite3').verbose();

var dbPath = './db/priKer.sqlite3';

module.exports = {

    createDb: function () {
        let db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.log('Error when creating the database', err)
            } else {
                console.log('Database created!')
                /* Put code to create table(s) here */
                db.serialize(function () {
                    db.run("CREATE TABLE IF NOT EXISTS PriceTrackLog (productName TEXT, SourceSite TEXT, BestPrice REAL, LastPrice REAL, CurrentPrice REAL, ProductLink TEXT )");
                    db.run("CREATE TABLE IF NOT EXISTS Product (productName TEXT, SourceSite TEXT, BestPrice REAL, LastPrice REAL, ProductLink TEXT )");

                    db.close();

                });


            }
        })


    },

    getProduct: function (productName) {
        console.log("Read data from getProduct");

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        });

        db.all("SELECT productName, SourceSite, BestPrice, LastPrice, ProductLink FROM Product", function (err, rows) {
            var arr = {};
            rows ?
                rows.forEach(function (row) {
                    arr = {
                        productName: row.productName,
                        SourceSite: row.SourceSite,
                        BestPrice: row.BestPrice,
                        LastPrice: row.LastPrice,
                        ProductLink: row.ProductLink
                    }
                }) : arr = null;

            db.close;
            return arr;
        });
    },
    insertProduct: function (productName, SourceSite, BestPrice, LastPrice, ProductLink) {
        console.log("Insert data")

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        });
        var stmt = db.prepare("INSERT INTO Product VALUES (?,?,?,?,?)");

        stmt.run(productName, SourceSite, BestPrice, LastPrice, ProductLink);

        stmt.finalize();

        db.close();

    },
    updateProductPrices: function (product) {

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {

            var stmt = db.prepare("UPDATE Product SET BestPrice = ? , LastPrice = ? WHERE productName =  ?");

            stmt.run(product.BestPrice, product.LastPrice, product.productName);

            stmt.finalize();

            // close the database connection
            db.close();

        });
    },
    insertPriceTrackLogData: function (productName, SourceSite, BestPrice, LastPrice, CurrentPrice, ProductLink) {
        console.log("Insert data");

        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {

            var stmt = db.prepare("INSERT INTO PriceTrackLog VALUES (?,?,?,?,?,?)");

            stmt.run(productName, SourceSite, BestPrice, LastPrice, CurrentPrice, ProductLink);

            stmt.finalize();
            db.close();

        });
    },
    readPriceTrackLogData: function () {
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {

            console.log("Read data from contacts");
            db.all("SELECT productName, SourceSite, BestPrice, LastPrice, CurrentPrice, ProductLink FROM PriceTrackLog", function (err, rows) {
                rows.forEach(function (row) {
                    console.log(productName + ": " + BestPrice);
                });
            });
        });
    }
}
