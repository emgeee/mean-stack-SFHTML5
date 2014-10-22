'use strict';

/**
 * @ngdoc function
 * @name meanDemoApp.controller:QuestionformCtrl
 * @description
 * # QuestionformCtrl
 * Controller of the meanDemoApp
 */
angular.module('meanDemoApp')
  .controller('QuestionformCtrl', function ($scope, Question) {
    $scope.question = {};
    $scope.submitQuestion = function() {
      if ($scope.question.text) {
        Question.save($scope.question,
          function() {
            $scope.question = {};
          });
      }
    };
  });
