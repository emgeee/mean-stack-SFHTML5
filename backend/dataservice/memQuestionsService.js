var ObjectID = require('mongodb').ObjectID;
var notifier = require('./notifier');
var questions = require('./sampleData').questions;

module.exports = {
    createQuestion:       createQuestion,
    deleteQuestion:       deleteQuestion,
    getQuestions:         getQuestions,
    getQuestionById:      getQuestionById,
    getQuestionSummaries: getQuestionSummaries,
    ready:                ready,
    voteForQuestion:      voteForQuestion
};

///////////////////////////////////////////

function ready(cb){ cb(); } // ready immediately

function getQuestions(req, res) {
    res.send( sortSkipTake(req) );
}




function getQuestionById(req, res, next) {
    var question = findQuestionById(req);
    if (question){
        res.send(question);
    } else {
        questionNotFound(next);
    }
}




function createQuestion(req, res, next) {

    // get the new data from the POST body
    var body = req.body || {};

    if (createBodyHasError(body, next)) { return; }

    // Build the question and save it
    var question = {
        _id:       ObjectID(),
        created:   Date.now(),
        text:      body.text,
        category:  body.category,
        name:      body.name,
        voteCount: 0,
        votes:     []
    };

    questions.push(question);

    notifier.questionAdded(question);

    res.send(question);

    //////// Error Checking

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

        else if ( questionExists(text) ){
            err = new Error('That question has been asked already');
            err.status=403; // forbidden
            next(err);
            return true;
        }
    }

    function questionExists(text) {
        return questions.some(function(q){
            return q.text.toLowerCase() === text.toLowerCase();
        });
    }
}





function voteForQuestion(req, res, next) {
    var question = findQuestionById(req);
    if (question){
        addVote(question, req);
        notifier.voteAdded(question);
        res.send(question);
    } else {
        questionNotFound(next);
    }

    function addVote(question, req){

        var votes = question.votes;

        // Get new votes from the body (or default to +1)
        var vote = parseInt(req.body && req.body.vote, 10);
        vote = isNaN(vote) ? 1 : vote;

        // Add a "vote event" to the votes array
        votes.push({ vote: vote, time: Date.now() });

        // Recalculate total vote count
        question.voteCount = votes.reduce(function(count, v){
                return count += v.vote || 0;}
            , 0);
    }
}




function getQuestionSummaries(req, res) {
    res.send( summarize( sortSkipTake(req) ) );
}




function deleteQuestion(req, res, next) {
    var question = findQuestionById(req);
    if (question){

        // delete it from the in-memory array with "splice"
        questions.splice(questions.indexOf(question), 1);

        notifier.questionDeleted(question);

        // respond with status and no content.
        res.status(204).end();

    } else {
        questionNotFound(next);
    }
}



////////////////////

function notImplemented(req, res, next) {
    next(new Error(
        'Data service method for ' + req.method + ' ' +
        req.originalUrl + ' is not implemented'
    ));
}


function findQuestionById(req){
    var id = req.params.id;

    if (id) {
        return questions.filter(function(q){
            return q._id.toString() === id;
        })[0];
    }
}


function questionNotFound(next){
    // Create an error and let downstream middleware handle it.
    var err = new Error('Question not found');
    err.status = 404;
    next(err);
}


function sortSkipTake(req){
    // copy the Questions collection so we can sort the copy
    var quests  = questions.slice();

    var sort = req.query.sort;

    if (sort === 'votes'){
        quests.sort(function(a, b){
            return a.voteCount < b.voteCount ? 1 : -1;
        });
    }

    else if (sort === 'time') {
        quests.sort(function(a, b){
            return a.created < b.created ? -1 : 1;
        });
    }

    var skip = +req.query.offset || 0 ;
    var take = +req.query.limit  || quests.length ;

    return quests.slice(skip, skip + take);
}


function summarize(quests){
    return quests.map(function(q){ return {
        _id: q._id,
        category: q.category,
        text: q.text,
        created: q.created,
        voteCount : q.voteCount
    };})
}
