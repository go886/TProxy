var fs = require('fs');
const path = require('path')

//ssl license

var keyPath = path.resolve(__dirname,'./ssl/yourkey.pem');
var certPath = path.resolve(__dirname,'./ssl/yourcert.pem');

var hskey = fs.readFileSync(keyPath);
var hscert = fs.readFileSync(certPath);

var options = {
    key: hskey,
    cert: hscert
};

//ssl object

var ssl = {};

ssl.options = options;

module.exports = ssl;