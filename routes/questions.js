var ObjectID = require('mongodb').ObjectID;
var db = require('./../database');

// get questions
exports.index = function(req, res, next) {

  var query = db.collection('questions').find({});

  if(req.query.limit) {
    query.limit(parseInt(req.query.limit,10));
  }
  if(req.query.offset) {
    query.skip(parseInt(req.query.offset,10));
  }

  if(req.query.sort) {
    var sort = req.query.sort;

    if(sort === 'votes') { query.sort({votes: -1}); }
    if(sort === 'time') { query.sort({_id: -1}); }
  }

  query.toArray(function(err, questions) {
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
    .findAndModify({
      _id: ObjectID(req.params.id)
    },
    [],
    { $inc: {votes: 1} },
    { w:1, new:true },
    function(err, question) {
      if(err) { return next(err); }

      return res.send(question);
    });
};
