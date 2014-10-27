# Conference Question Collector APIs

## Schema

Question is the lone document type.

	  _id: 5448b56b57675cbc246e6dbd,              //<object id>
	  created: 1412144732,                        // Date as integer
	  text: "What's the E in Mean stand for?",
	  category: "express",
	  name: "",                                   // ???
      voteCount: 2,                               // total net votes
	  votes: [{"vote": 1, "time": 1414090701953}, // vote events array
              {"vote": 2, "time": 1414090801953},
              {"vote": -1, "time":1414090901953}]

## Create question

`POST /api/questions`

Post data:

    {
        text: "What's the E in Mean stand for?",
        category: "express",
        name: "" 
    }

Returns 201 and the created question:

	{
	  _id: <object id>,
	  created: 1412144732,
	  text: "What's the E in Mean stand for?",
	  category: "express",
	  name: "",
	  voteCount: 0,
      votes: []
	}
  
## Upvote question

`POST /api/questions/:id/vote`

There is no post body or it is ignored. A post to this endpoint
adds one vote event to an existing question's votes array.

Returns 200 and the complete question:

	{
	  _id: <object id>,
	  created: 1412144732,
	  text: "What's the E in Mean stand for?",
	  category: "express",
	  name: "",
      voteCount: 1,
	  votes: [{
        "vote": 1,
        "time": 1414090701953
      }]
	}

## Fetch list of questions (w/ paging)

`GET /api/questions?sort={time|votes}&limit={integer}&offset={integer}`

* sorted by `time` or `votes` (descending)
* `limit` is the max number of questions returned.
* `offset` is the number of questions to skip first.

Returns 200 and an array of questions

## Get a question by id

`GET /api/questions/:id`

Returns 200 and the question or 404 if not found


## Fetch list of question summaries (w/ paging)

A question could have a lot of data. We might be interested only in a summary of each question when we retrieve a list of them.

Add a separate endpoint for this purpose:

`GET /api/questions/summaries?sort={time|votes}&limit={integer}&offset={integer}`

Its just like `GET /api/questions` except the JSON should include only this subset of fields for each Question: `{_id, category, text, created, voteCount}`


## Delete a question by id

Not sure if we should allow delete ... what the heck.

`DELETE /api/questions/:id`

Returns 204 (no content) and empty body or 404 if not found