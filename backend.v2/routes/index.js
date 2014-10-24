var router = require('express').Router();

// Switch between the dev and mongo services by setting MONGO=1
// ex (for bash/zsh): MONGO=1 npm start
// or (for fish): env MONGO=1 npm start
var data;

if(process.env.MONGO) {
  console.log('Using mongo');
  data = require('../mongoQuestionsService'); // MongoDb database
} else {
  console.log('Using in memory database');
  data = require('../devQuestionsService'); // in-memory dev database
}

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

module.exports = router;

/////////////
function notImplemented(req, res, next) {
    next(new Error(
            req.method + ' ' +
            req.originalUrl + ' is not implemented'
    ));
}
