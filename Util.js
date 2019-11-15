
module.exports = {

    mapToJson: function (map) {
        console.log("maptoJson 1");        console.log(map);
        var str= JSON.stringify(map);
        return str;
    },

    jsonToMap: function (jsonStr) {
        return new Map(JSON.parse(jsonStr));
    }

}