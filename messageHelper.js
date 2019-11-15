const request = require('request');
const cheerio = require('cheerio');

module.exports = {

    sendMessage : function(chatId,message){
        //TODO: ApiKet will move to Config
        //https://api.telegram.org/bot924160192:AAFJAPHrj_kyKwfRUiuifwOpwVuyFwBK-ho/sendMessage?chat_id=-331002272&text=Hello+World
        URL = "https://api.telegram.org/bot924160192:AAFJAPHrj_kyKwfRUiuifwOpwVuyFwBK-ho/sendMessage?chat_id=-"+chatId+"&text="+message+" ";

        request(URL, function (err, res, body) { 

            //console.log(URL); 
           // console.log(res); 
 /*            console.log(body); 
 */
            if(err) 
            { 
                console.log(err); 
            } 
            else
            { 

          
            } 
        }); 


    }
}