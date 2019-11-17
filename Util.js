
module.exports = {

    escapeAsci: function (str) {
        str = str.replace(/ı/gi, "i");
        str = str.replace(/İ/gi, "i");
        str = str.replace(/c/gi, "c");
        str = str.replace(/Ç/gi, "c");
        str = str.replace(/ü/gi, "u");
        str = str.replace(/Ü/gi, "u");
        str = str.replace(/ş/gi, "s");
        str = str.replace(/Ş/gi, "s");
        str = str.replace(/Ğ/gi, "g");
        str = str.replace(/ğ/gi, "g");
        str = str.replace(/}]};/gi, "}]}");
        return str;
    }

}