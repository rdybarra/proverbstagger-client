/**
 * verseFactory.js
 * 
 * A service to get verses.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .factory('verseFactory', ['$http', '$q', 'config', verseFactory]);

  function verseFactory($http, $q, config) {
    return {
      getVersesByKeyword: function(keyword) {
        var deferred = $q.defer();
        var url = config.apiUrl + '/verses/keyword/' + encodeURIComponent(keyword);
        $http.get(url).success(function(data) {
          deferred.resolve(data.verses);
        });
        return deferred.promise;
      },
      getVersesByChapter: function(chapter) {
        var deferred = $q.defer();
        var url = config.apiUrl + '/chapter/' + chapter;
        $http.get(url).success(function(data) {
          deferred.resolve(data.verses);
        });
        return deferred.promise;
      }
    };
  }

})();