(function(){

  var verseApp = angular.module('verseApp', ['ngRoute', 'rt.encodeuri', 'verses']);

  verseApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/keywords', {
          templateUrl: 'components/verses/templates/keyword-list.html',
          controller: 'KeywordsController'
        }).
        when('/keyword/:keyword', {
          templateUrl: 'components/verses/templates/verse-list.html',
          controller: 'VersesController'
        }).
        when('/chapter/:chapter', {
          templateUrl: 'components/verses/templates/verse-list.html',
          controller: 'VersesController'
        }).
        otherwise({
          templateUrl: 'components/verses/templates/verse-list.html',
          controller: 'VersesController'
        });
    }
  ]);

})();
