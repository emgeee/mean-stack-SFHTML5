var data = require('../dataservice');
var router = require('express').Router();

module.exports = router;

// router.use(notImplemented);

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

/////////////

function notImplemented(req, res, next) {
    next(new Error(
        req.method + ' ' +
        req.originalUrl + ' API is not implemented'
    ));
}
