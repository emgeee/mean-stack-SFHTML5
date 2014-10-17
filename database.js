
var mongo = require('mongoskin');
var uri = process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URI : "mongodb://localhost:27017/sfhtml_demo";

console.log('Connecting to', uri);
module.exports = mongo.db(uri, {native_parser:true});
