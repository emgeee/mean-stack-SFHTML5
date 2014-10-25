var mongo = require('mongoskin');
var uri = process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URI : "mongodb://localhost:27017/sfhtml_demo";

console.log('Connecting to MongoDb at ', uri);
var db = mongo.db(uri, {native_parser:true, auto_reconnect:true });

module.exports = db;
