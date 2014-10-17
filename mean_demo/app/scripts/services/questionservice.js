'use strict';

/**
 * @ngdoc service
 * @name meanDemoApp.questionService
 * @description
 * # questionService
 * Factory in the meanDemoApp.
 */
angular.module('meanDemoApp')
  .factory('Question', function ($resource) {

    var apiRootUrl = 'http://localhost:3000';

    return $resource(
      // apiRootUrl + "/questions/:id",
      "/questions/:id",
      {id: "@id" },
      { "update": {method:"PUT"} }
    );
  });
