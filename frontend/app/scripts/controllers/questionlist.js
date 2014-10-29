'use strict';

/**
 * @ngdoc function
 * @name conferenceAppApp.controller:QuestionlistPollingCtrl and QuestionlistListeningCtrl
 * @description
 * # Contains two implementations, QuestionlistPollingCtrl polls the server and updates the entire question list
 * # QuestionlistListeningCtrl listens for events and updates list of questions accordingly
 * Controller of the conferenceAppApp
 */
angular.module('meanDemoApp')
  .controller('QuestionlistPollingCtrl', function ($scope, $timeout, Question) {

    var pollInterval = 20000; // in milliseconds

    function getQuestions() {
      Question.query(null,
        function(questions) {
          $scope.questions = questions;
          pollInterval = 20000;
        }, function() {
          // if we fail for some reason, exponentially back off on the polling
          pollInterval *= 2;
        }).$promise.finally(function() {
          $timeout(getQuestions, pollInterval); // poll for new questions
        });
    }

    getQuestions();

    $scope.upvote = function(question) {
      Question.vote({id: question._id});
    };

    // Listen for updates

  })
  .controller('QuestionlistListeningCtrl', function ($scope, $timeout, Question) {

    $scope.questions = [];
    Question.query(null,
      function(questions) {
        $scope.questions = questions;
      });

    $scope.upvote = function(question) {
      Question.vote({id: question._id});
    };

    // Listen for updates

    $scope.$on('questionAdded', function(event, question) {
      $scope.$apply(function() {
        question.new = true;
        $scope.questions.unshift(question);
      });

      $timeout(function() {
        delete question.new;
      }, 2000);
    });

    $scope.$on('voteAdded', function (event, voteMsg) {
      $scope.$apply(function() {
        var questions = $scope.questions;
        for (var i=0, len=questions.length; i < len; i++){
          if (questions[i]._id === voteMsg.qid) {
            questions[i].voteCount = voteMsg.voteCount;
            break;
          }
        }
      });
    });

  });
