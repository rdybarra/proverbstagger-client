/**
 * app.js
 *
 * The proverbstagger app.
 */
(function() {
  'use strict';

  var verseApp = angular.module('verseApp', ['ngRoute', 'rt.encodeuri', 'verses']);

  verseApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/keywords', {
          templateUrl: 'components/verses/views/keyword-list.html',
          controller: 'BrowseController'
        }).
        when('/keyword/:keyword', {
          templateUrl: 'components/verses/views/verse-list.html',
          controller: 'VersesController'
        }).
        when('/chapter/:chapter', {
          templateUrl: 'components/verses/views/verse-list.html',
          controller: 'VersesController'
        }).
        when('/about', {
          templateUrl: 'components/static/views/about.html'
        }).
        otherwise({
          templateUrl: 'components/verses/views/verse-list.html',
          controller: 'VersesController'
        });
    }
  ]);

})();