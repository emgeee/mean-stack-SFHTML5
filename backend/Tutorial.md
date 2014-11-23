#Build the Backend From Scratch

From a clean slate we'll build a node/express data server that
satisfies the client app's data requirements, albeit with "development data".

After we've got the dev server set up, we'll replace the dummy development service with one that persists to MongoDb.

## Generate Node/Express Server

In a terminal or command window, create the application directory and run  the Express code generator there.

* `md mean-stack-SFHTML5 && cd mean-stack-SFHTML5`

* `md backend && cd backend`

* `express --ejs`

## Review and augment "package.json"

We'll need additional capabilities 

*  CORS support
*  MongoDb client for JavaScript


and we'll acquire them with additional packages;

* open "package.json" in editor

* add the following npm packages

        "cors": "^2.2.0",
        "mongodb": "^1.4.19",

## Install and run

Now we ask npm to install all this goodness

	npm install

Then we start the app and watch it run

	npm start

The node/express server is running locally on port 3000. Go there in the browser:

	http://localhost:3000

You should see the generated Express home page.

## Open the launch point: *bin/www*

**A data server needs its own port!**

Remember we intend to **serve the client application from a different server than this data server**.

There's an excellent chance that the client app server will be on port 3000 too. We're going to have a port conflict during development unless we change this data server's port.

The `express` generator defaulted the server's port to 3000 in ***/bin/www*** . Let's change that to something we think we'll be free, like 4567.

* open */bin/www*

* update the default port: 

		app.set('port', process.env.PORT || 4567);

* Let's log to the console while we're here. Add the following line immediately after `debug('Express server listening ...);`.

		console.log('Express data server listening on port ' + app.get('port'));

## Review the server code in *app.js*

The generator scaffolded a general purpose web server that, among other things, can generate HTML pages from templates with a view engine (EJS in this case).

We're building a data server. We won't be creating any pages. That means there's stuff we can delete.

We could get side-tracked with such cleanup. But we think quickly eliminating some of the material that we won't need will mean more clarity now and fewer distractions later.

1. Get rid of the view generation
	*  Erase the "view engine setup"
	*  Delete the views folder
<br/><br/>


1. Delete the references to "users" and "index" routes in "app.js" which we will not use:

        var routes = require('./routes/index');
        var users = require('./routes/users');

    and

        app.use('/', routes);
        app.use('/users', users);`

1. Delete the "users.js" files in the "routes" folder. Keep "index.js" which we'll re-purpose later.

## Fix the error handler

1. Delete the developer error handler; we don't have an error page any more.

1. Fix the production error handler, replacing `render` with `send`. We'll send errors to the client as JSON as a data API should do. Get rid of the `error` property as well. When done it should look like this:

	// no stack traces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500)
	       .send({
	            message: err.message
	        });
	});

## Add a static test page ("public/index.html")

1. create new ***index.html*** file under **"public/"** folder 

1. paste this into it:

		<!DOCTYPE html>
		<html>
		  <head>
		    <title>MEAN Demo API Server</title>
		    <link rel='stylesheet' href='/stylesheets/style.css' />
		  </head>
		  <body>
		    <h1>MEAN Demo API Server</h1>
		  </body>
		
		  <p><a href="api/questions">get all questions</a></p>
		  <p><a href="api/questions/5448b9286ef8c23446fd1767">get question by id</a></p>
		  <p><a href="api/questions?sort=votes&limit=3">get top 3 questions</a></p>
		  <hr>
		  <p><a href="foo">bad file</a></p>
		  <p><a href="api/bar">bad api route</a></p>
		</html>

## Add CORS

The browser will be running the client application from one address (e.g., `localhost:3000`) and requesting data from our data server at  `localhost:4567`.

That's a **BIG PROBLEM**. Browser's are not allowed to make those AJAX calls because of something called the **["Same Origin Policy"](http://en.wikipedia.org/wiki/Same-origin_policy)**.


Modern browsers CAN make such calls if the server allows them ... via the [CORS (Cross-Origin Resource Sharing)](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) protocol.

Fortunately, there's a nifty bit of Express middleware that makes it easy to enable CORS. 

Earlier we added the "cors" module to the *packages.json* file and installed it with *npm*. Now we chain it into to our Express middleware stack.

* open *app.js*

* Add the following to the stack ... right below "static" 

		app.use(require('cors')()); // enable ALL CORS requests

Our data server will now accept HTTP requests from any browser anywhere.

>If that sounds like a bad idea to you, you may have a point. The "Same Origin Policy" protects the server from some (lame) browser-based attacks and we just threw that guard away. Not a big deal IMO. If you feel otherwise, the "cors" module offers a wealth of configuration options. 

## Add an API router to the server code in *app.js*

The *API Requirements.md* documents the required data API.

All of the HTTP requests begin `~/api`.

We'll create an express [**router**](http://expressjs.com/api.html#router) for our API and "mount" it at `/api`.

* Tell app to use the router by adding the following line the "CORS" line we just added.

    app.use('/api', require('./routes')); // data api routes

* Open the "index.js" file under "routes"

* Replace entire contents with this

		var router = require('express').Router();
		
		router.use(notImplemented);
		
		module.exports = router;
		
		/////////

		function notImplemented(req, res, next) {
		    next(new Error(
		        req.method + ' ' +
		        req.originalUrl + ' API is not implemented'
		    ));
		}

Henceforth, every request we send that begins `~\api` should result in a "500 - API is not implemented" response. We'll test that in a moment.

## Test this API router v.0.1

* Launch the data server in a terminal or command window, preferably using the "[node-inspector](https://github.com/node-inspector/node-inspector "node-inspector")" debugger:

	`node-debug bin/www`

    > You can just use `node-debug bin/www` if you don't have "node-inspector" or don't want to debug with it.


* Navigate to `http://localhost:4567` in a browser tab. You should see our test page.

* Click the "bad file" link.  You should get a 404 "not found" reply. 

	The router is not involved yet. It won't get involved until it sees a route beginning `~/api`.

* Click any of the API links. This time you get the 500 - "Not implemented" message from the api router.  
 
    **Our api router is working**.



## Set the api routes.

The router should only pay attention to the required routes. It should decline a bogus route like `~/api/foo`.

Comment out `router.use(notImplemented);` and add this code:

	/* First match wins so the order of routes really matters! */
	
	// GET /api/questions/summaries
	router.get('/questions/summaries', data.getQuestionSummaries);

	// GET /api/questions/:id
	router.get('/questions/:id', data.getQuestionById);
	
	// GET /api/questions
	router.get('/questions', data.getQuestions);
	
	// POST /api/questions/:id/vote
	router.post('/questions/:id/vote', data.voteForQuestion);
	
	// POST /api/questions
	router.post('/questions', data.createQuestion);
	
	// DELETE /api/questions/:id
	router.delete('/questions/:id', data.deleteQuestion);

The first parameter passed to each router method defines a route template as indicated in the comment. 

Only requests that match one of these templates will be handled by this router. Anything else passes through and should result in a "404 - Not Found" error.

>The query string in the comment reminds us of the options we'll have to implement. The query string is not part of the template and does not participate in route matching.

The second parameter is a **route handler** function that processes the request for the matching route. The handler has the standard Express middleware function signature

	handler(req, res, next); // request-object, response-object, next-action-function

You can tell by the **`data.`** prefix that we expect these handlers to be members of a "data service" module ... which we're about to create. 

First we'll require that service at the top of the file. 

		var data = require('../dataservice');

Next we'll create that data service in a new file.

## Create the data service

Our data service will expose methods for getting fake Question data as if from a real database.

* Create a new ***dataservice*** directory. We'll be adding more to this directory over time.

* Add a new "*index.js*" file to that directory

* Add these module exports at the top of that file.

		module.exports = {
		    createQuestion:       notImplemented,
		    deleteQuestion:       notImplemented,
		    getQuestions:         notImplemented,
		    getQuestionById:      notImplemented,
	        getQuestionSummaries: notImplemented,
		    voteForQuestion:      notImplemented
		};

* It has a `notImplemented` function too:

		function notImplemented(req, res, next) {
		    next(new Error(
		        'Data service method for ' + req.method + ' ' +
		        req.originalUrl + ' is not implemented'
		    ));
		}

* Stop and re-start the server

* Try the "bad API" again

	This time you get "404-Not Found" because this request URL doesn't match any of the router's templates.


* Try `/api/questions` (a legitimate request)

	You get the expected "500-Not Implemented" error.

## GET questions

We'll start with the `getQuestions` method that fetches all of the questions from the database. 

We've prepared some sample Question data in "sampleData.js" for development and test purposes and we'll use those data in our data service.

* Copy "sampleData.js" from the github repository in the "~/backend/services" folder into your "services" folder.

* Populate the `questions` collection variable at the top of the file with the sample Questions in "sampleData".

		var questions = require('./sampleData').questions;

* Update the exports with the `getQuestions` method instead of `notImplemented`

		getQuestions: getQuestions,

* Implement that method in one line ... a line that simply sends the entire array of questions to the client.

		function getQuestions(req, res) {
		    res.send( questions );
		}

		
* Stop and re-start the server
 
* Re-try `/api/questions`

This time you should see JSON question data displayed in the browser.

## GET question by ID

`getQuestionById` is one of several methods that fetch a Question by its id:

	getQuestionById // GET    /api/questions/:id
	voteForQuestion // POST   /api/questions/:id/vote
	deleteQuestion  // DELETE /api/questions/:id

They all need a `:id` parameter. They all return a 404 if they can't find a Question with that id. We'll start with `getQuestionsById`

* Update the exports with `getQuestionsById` instead of `notImplemented`

		getQuestionsById: getQuestionsById,

* Here's its implementation:

		function getQuestionById(req, res, next) {
		    var question = findQuestionById(req);
		    if (question){
		        res.send(question);
		    } else {
		        questionNotFound(next);
		    }
		}

* Here is the `findQuestionById` helper function.

		function findQuestionById(req){
		    var id = req.params.id;
		
		    if (id) {
		        return questions.filter(function(q){
		            return q._id.toString() === id;
		        })[0];
		    }
		}

	Note that we are filtering on the Question's primary key property which is named **`_id`**, not `id`. 

    We're anticipating storage in MongoDb which insists that every document have a primary key named "\_id". It is customary for the `_id` to be the object returned by MongoDb's `ObjectID` function. We have to `toString()` that object in order to compare it with the request parameter which is a string. 

* Here's the "Not found" failure function:

		function questionNotFound(next){
		    // Create an error and let downstream middleware handle it.
		    var err = new Error('Question not found');
		    err.status = 404;
		    next(err);
		}

* Stop and re-start the server
 
* Re-try with one of the sample data ids

		localhost:4567/api/questions/5448b9286ef8c23446fd1767

	You should see JSON data for a real question. 

* Now try with a bad id:

		localhost:4567/api/questions/doh

	Should get the "404 - Question not found" error from the router.

## Create a question


* Update the exports with `createQuestions` instead of `notImplemented`

		createQuestions: createQuestions,

* Here's its implementation:

		function createQuestion(req, res, next) {
		
		    // get the new data from the POST body
		    var body = req.body || {};
		
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
		
		    res.send(question);
		}

There's almost no error checking at all. What if there's no text? What if someone asks the same question twice? Let's insert some guard logic.

* Add this line below `var body = ...` to call an error checking routine

    	if (createBodyHasError(body, next)) { return; }

* Append the following to `createQuestion` 

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

## Test it with Postman!

The HTTP method for create is a POST with a request body. You can't use the browser to make that request.

Fortunately, there's a great [extension for Chrome called "Postman"](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)

After installing Postman, look in this demo project for the JSON file ***Postman_MEAN_Demo.json***. It's a collection of Postman requests to help us explore this API.

* Open Postman
* Click the "Collections" button
* Click the "inbox" icon that means "*Import collection*"
* Drag-n-drop *Postman_MEAN_Demo.json* onto the import dialog

A new "MEAN Demo" entry appears in Postman's collections list. Click on it to see the available requests.

### Try it

* Stop and re-start the server

* Select "CREATE a question" in Postman

* Click the "Send" button; it should respond successfully with Question JSON.

* Click the "Send" button again; this time you should get a "403 - Forbidden" error because you tried to create the same question twice.

>Play around with the input data values. Try changing or deleting various of the property names and values.

## Vote for a question

According to the api spec, we can vote for a question with a simple POST request. No POST body or URL query string parameters required.

`POST /api/questions/:id/vote`

>Privately we wonder why this endpoint returns the complete question rather than just the `{_id, voteCount}`. For now we simply obey.


* Update the exports with `voteForQuestion` instead of `notImplemented`

		voteForQuestion: voteForQuestion

* Here is its implementation:

		function voteForQuestion(req, res, next) {
		    var question = findQuestionById(req);
		    if (question){
		        addVote(question, req);
		        res.send(question);
		    } else {
		        questionNotFound(next);
		    }
		}

	Observe that we are re-using the `findQuestionById` and `questionNotFound` methods that we wrote earlier for `getQuestionById`.

* Add the `addVote` method to create the "vote event" and update the `voteCount`.

	    function addVote(question, req){
	        
	        var votes = question.votes;
	
	        // Add a "vote event" to the votes array
	        votes.push({ vote: 1, time: Date.now() });
	
	        // Recalculate total vote count
	        question.voteCount = votes.reduce(function(count, v){
	                return count += v.vote || 0;}
	            , 0);
	    }


### Support down votes and multiple votes

We developers want to support "down votes" (a negative vote) and enable users to show their appreciation by saying "+100".

This capability wasn't in the requirements ... but we couldn't help ourselves. It's only a few more lines :-) 

If there is a POST body and it has an integer `vote` property, we'll use it to determine how many votes were cast. Here's the revised implementation:

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

FWIW, this extension was quite handy when we generated the development data.

### Try it in Postman

* Stop and re-start the server

* Try any of the "VOTE ..." requests in Postman


## Get Question Summaries

The data for a Question is getting pretty big now that we're tracking every vote event. It's not too bad when retrieving a single Question but it is unwieldy when we retrieve a lot of them.

The API specifies a "Get Question Summaries" variation that reduces the query results payload.


* Update the exports with this method instead of `notImplemented`

		getQuestionSummaries: getQuestionSummaries,

* Implement it with one line:

		function getQuestionSummaries(req, res) {
			res.send( summarize(questions) );
		}

* Write the `summarize` helper function that "projects" a full Question into its summary form.
 	
		function summarize(quests){
		    return quests.map(function(q){ return {
		        _id: q._id,
		        category: q.category,
		        text: q.text,
		        created: q.created,
		        voteCount : q.voteCount
		    };})
		}

## Sorting and Paging

The two "Get questions" endpoints should support optional sorting and paging with query string parameters as explained in the requirements:

	GET /api/questions?sort={time|votes}&limit={integer}&offset={integer}
	GET /api/questions/summaries?sort={time|votes}&limit={integer}&offset={integer}

The optional query string parameters are:

* `sort` - sort Questions by "time" (ascending by `created`) or by "votes" (descending `voteCount`)

* `limit` - an integer limit on the number of Questions to return

* `offset` - the number of Questions to skip first

The `getQuestions` implementation changes slightly to accommodate these features:

	res.send( sortSkipTake(req) );

As does the `getQuestionSummaries`:

    res.send( summarize( sortSkipTake(req) ) );

We've encapsulated the sorting and paging into a `sortSkipTake` helper function which extracts the optional parameters from the request and does the right thing with them:

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

## Delete question

We should be getting the hang of this now:


* Update the exports with the `deleteQuestion` method instead of `notImplemented`

		deleteQuestion: deleteQuestion,

* Here's the implementation
 
		function deleteQuestion(req, res, next) {
		    var question = findQuestionById(req);
		    if (question){
	
		        // delete it from the in-memory array with "splice"
		        questions.splice(questions.indexOf(question), 1);
	
		        // respond with status and no content.
		        res.status(204).end();
	
		    } else {
		        questionNotFound(next);
		    }
		}

Again we re-use the `findQuestionById` and `questionNotFound` methods we wrote for `getQuestionById`

# We're Done ... for now

We've built a data server in Node and Express that can support the client application developer.

True, it serves phony data from an in-memory "database" ... data that are erased and regenerated every time we start the server.

We're ready for the next phase of the journey ... replacing this "dev data service" with a "production data service" that persists to a MondoDb database.
