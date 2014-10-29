var ObjectID = require('mongodb').ObjectID;
var notifier = require('./notifier');
var db, Questions;

module.exports = {
    createQuestion:       createQuestion,
    deleteQuestion:       deleteQuestion,
    getQuestions:         getQuestions,
    getQuestionById:      getQuestionById,
    getQuestionSummaries: getQuestionSummaries,
    ready:                ready,
    voteForQuestion:      voteForQuestion
};

////////////////////

function ready(cb){ // ready when MongoDb is initialize
    var database = require('./database').start(function(){
        db = database.db;
        Questions = db.collection('questions');
        cb();
    });
    return module.exports;
}

// Prepare a "Get Questions" query based on request parameters and optional 'fields'
function getQuestionsQuery(req, fields){

    var options = {};
    var query = req.query; // request query string params

    if(query.limit) {
        options.limit = parseInt(query.limit,10);
    }
    if(query.offset) {
        options.skip = parseInt(query.offset,10);
    }

    if(query.sort) {
        var sort = query.sort;
        if(sort === 'votes') { options.sort = {voteCount: -1}; }
        if(sort === 'time')  { options.sort = {created: 1}; }

        // Could sort on _id as proxy for the created property, e.g.
        //   if(sort === 'time') { query.sort({_id: 1}); }
        // This assumes that created and _id are in sync.
        // _id is very fast because it's the key and there's an index
        // but note that ObjectID lacks sub-second time resolution.
        // Let's keep it obvious and sort on created.
    }

    return Questions.find({}, fields, options);
}


function getQuestions(req, res, next) {

  var query = getQuestionsQuery(req);
  query.toArray(function(err, quests) {
    if(err) { return next(err); }

    return res.send(quests);
  });
}


function getQuestionSummaries(req, res, next) {

    // Keep only the "summary" fields
    var fields = {
            _id: 1,
            category: 1,
            text: 1,
            created: 1,
            voteCount : 1
        };

    var query = getQuestionsQuery(req, fields);
    query.toArray(function(err, quests) {
        if(err) { return next(err); }

        return res.send(quests);
    });
}


function getQuestionById(req, res, next) {

    Questions.findOne({_id: ObjectID(req.params.id)}, function(err, question) {
        if(err) { return next(err); }

        if (question){
            return res.send(question);
        } else {
            questionNotFound(next);
        }
    });
}


function createQuestion(req, res, next) {

    // get the new data from the POST body
    var body = req.body || {};

    if (createBodyHasError(body, next)) { return; }

    // Check for duplicate; save question if not duplicate
    Questions.findOne({text: body.text}, function(err, question) {
        if(err) { return next(err); }

        if (question) {
            err = new Error('That question has been asked already');
            err.status=403; // forbidden
            next(err);
            return;
        }

        saveQuestion();
    });

    ///////////

    function saveQuestion(){
        // Build the question and save it
        // let MongoDb generate the ObjectID
        var question = {
            created:   Date.now(),
            text:      body.text,
            category:  body.category,
            name:      body.name,
            voteCount: 0,
            votes:     []
        };

        Questions.insert(question, {w:1}, function(err) {
            if(err) { return next(err); }

            notifier.questionAdded(question);
            return res.send(question);
        });
    }

    function createBodyHasError(body, next){
        var text = body.text = (body.text || '').trim();
        body.category = (body.category || 'unknown').trim();
        body.name = (body.name || '').trim();

        // Error checking
        if (!text){
            var err = new Error('New question must have text');
            err.status=400;
            next(err)
            return true;
        }

        // defer duplicate checking to MongoDb
    }
}



function voteForQuestion(req, res, next) {
    // Get new votes from the body (or default to +1)
    var vote = parseInt(req.body && req.body.vote, 10);
    vote = isNaN(vote) ? 1 : vote;

    // Add a "vote event" to the votes array
    var voteEvent = { vote: vote, time: Date.now() };

    Questions.findAndModify(
        { _id: ObjectID(req.params.id) },
        [],
        {
            $inc:  {voteCount: vote},
            $push: {votes:     voteEvent}
        },
        { w:1, new:true },

        function(err, question) {
            if(err) { return next(err); }

            if (question){
                notifier.voteAdded(question);
                return res.send(question);
            } else {
                questionNotFound(next);
            }
        }
    );
}


function deleteQuestion(req, res, next){

    Questions.findAndRemove(
        {_id: ObjectID(req.params.id)},
        [],
        { w:1},

        function(err, question) {
            if(err) { return next(err); }

            if (question){
                notifier.questionDeleted(question);
                // respond with status and no content.
                res.status(204).end();
            } else {
                questionNotFound(next)
            }
        });
}

////////////////////

function notImplemented(req, res, next) {
    next(new Error(
            req.method + ' ' +
            req.originalUrl + ' is not implemented'
    ));
}

function questionNotFound(next){
    // Create an error and let downstream middleware handle it.
    var err = new Error('Question not found');
    err.status = 404;
    next(err);
}
