'use strict';

describe('Controller: QuestionformCtrl', function () {

  // load the controller's module
  beforeEach(module('meanDemoApp'));

  var QuestionformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionformCtrl = $controller('QuestionformCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
