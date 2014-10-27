angular.module('meanDemoApp')
.directive('categorySelector', function() {
  return {
    restrict: "E",
    replace: true,
    scope: {
      question: '='
    },
    template: '<select class="cs-select"></select>',
    compile: function(tElem) {
      var categories = ['', 'mongo', 'express', 'angular', 'node'];
      categories.forEach(function(category) {
        tElem.append(angular.element('<option>' + category + '</option>'));
      });
      return function(scope, iElem) {
        var currentSelected = '';
        var selectFx = new SelectFx(iElem[0], {
          onChange: function(option) {
            currentSelected = option;
            scope.question.category = currentSelected;
          }
        });

        scope.$watch('question.category', function(newVal) {
          newVal = newVal || '';
          if (newVal != currentSelected) {
            currentSelected = newVal;
            selectFx.select(currentSelected);
          }
        });
      }
    },
  };
});



