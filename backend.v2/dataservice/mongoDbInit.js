module.exports.load = load;
//////////////////////
function load(db, callback){

    if (process.env.NODE_ENV === 'production') {
        // DO NOT RE-INITIALIZE PRODUCTION DB
        callback();
        return;
    }

    var col = db.collection('questions');

    // Remove all existing question
    col.remove({}, initialize);

    // Initialize with sample questions
    function initialize(err){
        if (err){
            callback(err);
            return;
        }
        var questions = require('./sampleData').questions; // sample data
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
                        if (count === len){
                            console.log('Initialized database with '+count+' questions');
                            callback();
                        }
                    }
                })(i));
        }

        /*** Todo: use bulk insert instead of iterating.
         var bulk = col.initializeUnorderedBulkOp();
         for (var i = 0; i < questions.len; i++) {
            bulk.insert(questions[i]);
        }
         bulk.execute(function(err,result) {
            if (err){
                callback(err);
                return;
            }
            console.log('Initialized database with '+count+' questions');
            callback();
        });
         */
    }
}
