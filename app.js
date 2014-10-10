var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db;

// connect to mongodb
MongoClient.connect("mongodb://localhost:27017/sfhtml_demo", function(err, database) {
  if(err) { throw err; }

  db = database;
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options('/questions', function(req, res){
  res.header("Access-Control-Allow-Origin", "http://localhost:9000");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,,Content-Type, Authorization');
  res.end('');
});

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    next();
});

app.get('/questions', function(req, res, next) {
  db.collection('questions')
    .find({})
    .sort({votes: 1})
    .toArray(function(err, questions) {
      if(err) { return next(err); }

      return res.send(questions);
    });
});


app.post('/questions', function(req, res, next) {
  var question = req.body;
  question.votes = 0;
  db.collection('questions')
    .insert(question, {w:1}, function(err) {
      if(err) { return next(err); }

      return res.send(question);
    });

});

app.put('/questions/:id', function(req, res, next) {

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

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
