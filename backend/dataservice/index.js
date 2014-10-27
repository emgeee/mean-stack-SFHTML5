var serviceName;
// Switch between the dev in-memory service and mongo service by
// setting env var MONGO=1 or mentioning "mongo" as on of the args
// ex (for bash/zsh): MONGO=1 npm start
// or (for fish): env MONGO=1 npm start
// or node bin/www mongo
// or node-debug bin/www mongo
var useMongoDb = process.env.MONGO ||                    // environment var
                 /~mongo/i.test(process.argv.join('~')); // launch argument

if (useMongoDb) {
    console.log('Using MongoDb database');
    serviceName = './mongoQuestionsService';
} else {
    console.log('Using in-memory database');
    serviceName = './memQuestionsService';
}

module.exports = require(serviceName);
