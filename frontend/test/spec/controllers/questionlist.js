'use strict';

describe('Controller: QuestionlistCtrl', function () {

  // load the controller's module
  beforeEach(module('meanDemoApp'));

  var QuestionlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionlistCtrl = $controller('QuestionlistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
