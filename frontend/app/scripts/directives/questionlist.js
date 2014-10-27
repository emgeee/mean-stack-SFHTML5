angular.module('meanDemoApp')
.directive('questionList', function() {
  return {
    restrict: "EA",
    scope: {},
    controller: 'QuestionlistListeningCtrl',
    templateUrl: '/views/question-list.tpl.html'
  };
});
