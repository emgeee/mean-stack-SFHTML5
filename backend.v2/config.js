var config = {
    data: null,
    dbType: null
};

// Switch between the dev in-memory service and mongo service by setting MONGO=1
// or mentioning "mongo" in the args
// ex (for bash/zsh): MONGO=1 npm start
// or (for fish): env MONGO=1 npm start
// or node bin/www mongo
// or node-debug bin/www mongo

if(process.env.MONGO || /~mongo/i.test(process.argv.join('~'))) {
  console.log('Using MongoDb database');
  config.data = require('./services/mongoQuestionsService'); // MongoDb data service
  config.dbType = "MongoDb";

} else {
  console.log('Using in-memory database');
  config.data = require('./services/devQuestionsService'); // in-memory data service
  config.dbType = "in-memory";
}

module.exports = config;
