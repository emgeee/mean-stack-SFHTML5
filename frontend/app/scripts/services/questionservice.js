'use strict';

/**
 * @ngdoc service
 * @name meanDemoApp.questionService
 * @description
 * # questionService
 * Factory in the meanDemoApp.
 */
angular.module('meanDemoApp')
  .factory('Question', function ($resource, $rootScope, $location) {

    var rootUrl = 'http://localhost:4567';
    var apiRootUrl = rootUrl + '/api';

    broadcastEvents();

    return $resource(
      apiRootUrl + '/questions/:id',
      { id: '@id' },
      { vote: {
        method: 'POST',
        url: apiRootUrl + '/questions/:id/vote' }
      }
    );

    function broadcastEvents(){
        var socket = window.io.connect(rootUrl);

        socket.on('questionAdded', function (question) {
          $rootScope.$broadcast('questionAdded', question);
        });

        socket.on('questionDeleted', function (questionId) {
          $rootScope.$broadcast('questionDeleted', questionId);
        });

        socket.on('voteAdded', function (voteMsg) {
          $rootScope.$broadcast('voteAdded', voteMsg);
        });
    }
  });
