
var mongo = require('mongoskin');
module.exports = mongo.db("mongodb://localhost:27017/sfhtml_demo", {native_parser:true});
