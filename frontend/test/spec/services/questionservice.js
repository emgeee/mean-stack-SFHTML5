'use strict';

describe('Service: questionService', function () {

  // load the service's module
  beforeEach(module('meanDemoApp'));

  // instantiate service
  var questionService;
  beforeEach(inject(function (_questionService_) {
    questionService = _questionService_;
  }));

  it('should do something', function () {
    expect(!!questionService).toBe(true);
  });

});
