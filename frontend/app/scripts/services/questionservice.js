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

    var rootUrl = 'http://localhost:4567';
    var apiRootUrl = rootUrl + '/api';

    logNotifications();

    return $resource(
      apiRootUrl + "/questions/:id",
      {id: "@id" },
      { "update": {method:"PUT"} }
    );

    //////////////
    function logNotifications(){
        var socket = window.io.connect(rootUrl);

        socket.on('questionAdded', function (question) {
            console.log('questionAdded: '+JSON.stringify(question));
        });

        socket.on('questionDeleted', function (questionId) {
            console.log('questionDeleted: '+questionId);
        });

        socket.on('voteAdded', function (voteMsg) {
            console.log('voteAdded: '+JSON.stringify(voteMsg));
        });

    }
  });
