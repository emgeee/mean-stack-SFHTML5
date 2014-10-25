var MongoClient = require('mongodb').MongoClient;

var uri = process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URI : "mongodb://localhost:27017/sfhtml_demo";

console.log('Connecting to MongoDb at ', uri);

var db;

module.exports = {
  isReady: isReady,
  getDb: function () {
    return db;
  }
};

function isReady(cb) {
  MongoClient.connect(uri, function(err, database) {
    db = database;

    return loadInitialData(cb);
  });
}

//////////////////////
function loadInitialData(callback){

    if (process.env.NODE_ENV === 'production') {
        // DO NOT RE-INITIALIZE PRODUCTION DB
        if (callback) {callback();}
        return;
    }

    var questions = require('./devData').questions;
    var col = db.collection('questions');
    col.remove({}, function(err, result){
        killServerIfError(err);
        var count = 0;
        for (var i = 0, len = questions.length; i < len; i++) {
            col.insert(questions[i],
                {w:1},
                (function(i){
                    return function(err) {
                        killServerIfError(err);
                        //console.log("Inserted #"+i);
                        count += 1;
                        if (count == len){
                            console.log('Finished initializing database with '+count+' questions');
                            if (callback) callback();
                        }
                    }
                })(i));
        }

        /*** can't get bulk insert to work with mongoskin
        var bulk = db.collection('questions').initializeUnorderedBulkOp();
        for (var i = 0; i < questions.len; i++) {
            bulk.insert(questions[i]);
        }
        bulk.execute(function(err,result) {
            killServerIfError(err);
            if (callback) { callback(); }
        });
        */
    });

    function killServerIfError(err){
        if(err) {
            err.message = 'Bulk load of initial data failed.\n' + err.message;
            throw err; // We're cooked. Terminate.
        }
    }
}
