module.exports.load = load;
//////////////////////
function load(db, callback){

    if (process.env.NODE_ENV === 'production') {
        // DO NOT RE-INITIALIZE PRODUCTION DB
        callback();
        return;
    }

    var questions = require('./devData').questions; // sample data
    var col = db.collection('questions');
    col.remove({}, function(err){
        if (err){
            callback(err);
            return;
        }
        var count = 0;
        for (var i = 0, len = questions.length; i < len; i++) {
            col.insert(questions[i],
                {w:1},
                (function(i){
                    return function(err) {
                        if (err){
                            callback(err);
                            return;
                        }
                        //console.log("Inserted #"+i);
                        count += 1;
                        if (count == len){
                            console.log('Initialized database with '+count+' questions');
                            callback();
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
}
