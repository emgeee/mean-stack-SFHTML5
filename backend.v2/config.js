

var data;
var isReady;

var config = {
  data: null,
  isReady: isReady
};

if(process.env.MONGO) {
  console.log('Using mongo');

  config.isReady = function(cb) {
    require('./services/database').isReady(function(){
        config.data = require('./services/mongoQuestionsService'); // MongoDb database
        return cb();
    });
  };
} else {
  console.log('Using in memory database');
  config.data = require('./services/devQuestionsService'); // in-memory dev database

  config.isReady = function(cb) {
    return cb();
  };
}


module.exports = config;
