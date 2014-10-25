var router = require('express').Router();
module.exports = router;

var data = require('../config').data;
data.ready(setRoutes);

// router.use(notImplemented);

function setRoutes(){

    /* First match wins so the order of routes really matters! */

    // GET /api/questions/summaries?sort={time|votes}&limit={integer}&offset={integer}
    router.get('/questions/summaries', data.getQuestionSummaries);

    // GET /api/questions/:id
    router.get('/questions/:id', data.getQuestionById);

    //GET /api/questions?sort={time|votes}&limit={integer}&offset={integer}
    router.get('/questions', data.getQuestions);

    // POST /api/questions/:id/vote
    router.post('/questions/:id/vote', data.voteForQuestion);

    // POST /api/questions
    router.post('/questions', data.createQuestion);

    // DELETE /api/questions/{:id
    router.delete('/questions/:id', data.deleteQuestion);

    console.log("data api routes are ready");
}


/////////////
function notImplemented(req, res, next) {
    next(new Error(
            req.method + ' ' +
            req.originalUrl + ' is not implemented'
    ));
}
