var config = {
    data: null,
    dbType: null,
    ready: null
};

// Switch between the dev in-memory service and mongo service by setting MONGO=1
// ex (for bash/zsh): MONGO=1 npm start
// or (for fish): env MONGO=1 npm start

if(process.env.MONGO) {
  console.log('Using MongoDb database');
  config.ready = function(cb) {
    require('./services/database').start(function(){
        config.data = require('./services/mongoQuestionsService'); // MongoDb data service
        config.dbType = "MongoDb";
        config.ready = function(cb) {cb();};
        return cb();
    });
  };

} else {
  console.log('Using in-memory database');
  config.ready = function(cb) {
      config.data = require('./services/devQuestionsService'); // in-memory data service
      config.dbType = "in-memory";
      config.ready = function(cb) {cb();};
      return cb();
  };
}

module.exports = config;
