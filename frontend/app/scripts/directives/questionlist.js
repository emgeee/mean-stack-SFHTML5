angular.module('meanDemoApp')
.directive('questionList', function() {
  return {
    restrict: "EA",
    scope: {},
    controller: 'QuestionlistCtrl',
    templateUrl: '/views/question-list.tpl.html'
  };
});
