angular.module('meanDemoApp')
.directive('questionForm', function() {
  return {
    restrict: "EA",
    scope: {},
    controller: 'QuestionformCtrl',
    templateUrl: '/views/question-form.tpl.html'
  };
});
