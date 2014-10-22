'use strict';

/**
 * @ngdoc function
 * @name conferenceAppApp.controller:QuestionlistCtrl
 * @description
 * # QuestionlistCtrl
 * Controller of the conferenceAppApp
 */
angular.module('meanDemoApp')
  .controller('QuestionlistCtrl', function ($scope, Question) {

    Question.query(null,
      function(questions) {
        $scope.questions = questions;
      });

  });
