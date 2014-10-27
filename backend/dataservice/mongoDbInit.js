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
    col.remove({}, function(err){
        if (err){
            callback(err);
            return;
        }
        initialize();
    });

    // Initialize with sample questions
    function initialize(){
        var questions = require('./sampleData').questions;
        var bulk = col.initializeUnorderedBulkOp();
        var count = questions.length;
        for (var i = 0; i < count; i++) {
            bulk.insert(questions[i]);
        }
        bulk.execute(function(err){
            if (err){
                callback(err);
                return;
            }
            console.log('Initialized database with '+count+' questions');
            callback();
        });
    }
}
