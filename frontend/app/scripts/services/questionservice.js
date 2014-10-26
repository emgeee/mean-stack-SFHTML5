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

    var apiRootUrl = 'http://localhost:4567/api';

    return $resource(
      apiRootUrl + "/questions/:id",
      {id: "@id" },
      { "update": {method:"PUT"} }
    );
  });
