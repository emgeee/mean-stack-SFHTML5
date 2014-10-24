/* Development Question Data */
var ObjectID = require('mongodb').ObjectID;

var questions =[
    {
        "_id": ObjectID("5448b56b57675cbc246e6dbd"),
        "created": 1414051179211,
        "text": "What's the E in Mean stand for?",
        "category": "express",
        "name": "Bob",
        "voteCount": 100,
        "votes": [
            {
                "vote": 1,
                "time": 1414090701953
            },
            {
                "vote": 99,
                "time": 1414090739945
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1764"),
        "created": 1414061376195,
        "text": "Do I have to write my own directives?",
        "category": "angular",
        "name": "Rose",
        "voteCount": 4,
        "votes": [
            {
                "vote": 1,
                "time": 1414090250017
            },
            {
                "vote": 4,
                "time": 1414090258656
            },
            {
                "vote": -1,
                "time": 1414090265583
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1765"),
        "created": 1414064736195,
        "text": "What is $scope?",
        "category": "angular",
        "name": "Jimmy",
        "voteCount": 2,
        "votes": [
            {
                "vote": 2,
                "time": 1414090288064
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1766"),
        "created": 1414065036195,
        "text": "Are document writes atomic?",
        "category": "mongo",
        "name": "Herb",
        "voteCount": 5,
        "votes": [
            {
                "vote": 2,
                "time": 1414090302912
            },
            {
                "vote": 3,
                "time": 1414090307760
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1767"),
        "created": 1414065516195,
        "text": "What good is Angular's Dependency Injection?",
        "category": "angular",
        "name": "Ima Troll",
        "voteCount": 36,
        "votes": [
            {
                "vote": 1,
                "time": 1414089823822
            },
            {
                "vote": 3,
                "time": 1414089833519
            },
            {
                "vote": 17,
                "time": 1414089949897
            },
            {
                "vote": 15,
                "time": 1414090371385
            }
        ]
    },
    {
        "_id": ObjectID("5448b56b57675cbc246e6dbe"),
        "created": 1414051239211,
        "text": "What is a NoSQL database?",
        "category": "mongodb",
        "name": "Sally",
        "voteCount": 21,
        "votes": [
            {
                "vote": 21,
                "time": 1414090398201
            }
        ]
    },
    {
        "_id": ObjectID("5448b56b57675cbc246e6dbf"),
        "created": 1414054779211,
        "text": "Are there alternatives to express?",
        "category": "express",
        "name": "R. U. Nutz",
        "voteCount": 5,
        "votes": [
            {
                "vote": 5,
                "time": 1414090412474
            }
        ]
    },
    {
        "_id": ObjectID("5448b56b57675cbc246e6dc0"),
        "created": 1414058379211,
        "text": "What is 'Dirty Checking'?",
        "category": "angular",
        "name": "Sheila Donough",
        "voteCount": 15,
        "votes": [
            {
                "vote": 15,
                "time": 1414090427881
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1760"),
        "created": 1414061136195,
        "text": "Is Node written in JavaScript?",
        "category": "node",
        "name": "Julias",
        "voteCount": 0,
        "votes": []
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1761"),
        "created": 1414061196195,
        "text": "Does Node have promises?",
        "category": "node",
        "name": "Vernon",
        "voteCount": 50,
        "votes": [
            {
                "vote": 50,
                "time": 1414090453065
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1762"),
        "created": 1414061256195,
        "text": "Why do we need CORS?",
        "category": "express",
        "name": "Grace",
        "voteCount": 20,
        "votes": [
            {
                "vote": 20,
                "time": 1414090464649
            }
        ]
    },
    {
        "_id": ObjectID("5448b9286ef8c23446fd1763"),
        "created": 1414061316195,
        "text": "Can I run Node on a client?",
        "category": "node",
        "name": "Ariel",
        "voteCount": 3,
        "votes": [
            {
                "vote": 3,
                "time": 1414090476353
            }
        ]
    }
];

exports.questions = questions;
