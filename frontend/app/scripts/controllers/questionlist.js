'use strict';

/**
 * @ngdoc function
 * @name conferenceAppApp.controller:QuestionlistCtrl
 * @description
 * # QuestionlistCtrl
 * Controller of the conferenceAppApp
 */
angular.module('meanDemoApp')
  .controller('QuestionlistCtrl', function ($scope, $timeout, Question) {

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
  });
