
var db = require('./database');

//TODO: call this db initialization logic such that server won't listen until it's done
exports.load = loadInitialData;

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