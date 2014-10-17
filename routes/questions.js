var ObjectID = require('mongodb').ObjectID;
var db = require('./../database');

// get questions
exports.index = function(req, res, next) {
  db.collection('questions')
    .find({})
    .sort({votes: 1})
    .toArray(function(err, questions) {
      if(err) { return next(err); }

      return res.send(questions);
    });
};

// create question
exports.create = function(req, res, next) {
  var question = req.body;
  question.votes = 0;
  db.collection('questions')
    .insert(question, {w:1}, function(err) {
      if(err) { return next(err); }

      return res.send(question);
    });
};

// Upvote question
exports.upvote = function(req, res, next) {

  db.collection('questions')
    .update({
      _id: ObjectID(req.params.id)
    },
    { $inc: {votes: 1} },
    { w:1 },
    function(err, question) {
      if(err) { return next(err); }

      return res.send({success: true});
    });
};
