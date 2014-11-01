/**
 * keywordFactory.js
 * 
 * A service to manage keywords that belong to verses via an association.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .factory('keywordFactory', ['$http', '$q', 'config', keywordFactory]);

  function keywordFactory($http, $q, config) {
    return {
      addAssociation: function(verse, keyword) {
          var deferred = $q.defer();
          var unique = true;

          for (var i = 0; i < verse.keyword_associations.length; i++) {

            if (keyword.value == verse.keyword_associations[i].keyword.value) {
              unique = false;
              var foundAssociation = verse.keyword_associations[i];

              var data = {
                'verse_id': foundAssociation.verse_id,
                'keyword_id': foundAssociation.keyword_id,
                'count': foundAssociation.count + 1
              };

              $http({ method: 'PATCH', url: config.apiUrl + '/keyword_associations/' + foundAssociation.id, data: angular.toJson(data)}).success(function(association) {
                foundAssociation.count = association.count;
                deferred.resolve(association.count);
              });
            }
          };

          if (unique) {
            var data = {
              'verse_id': verse.id,
              'keyword': keyword
            };

            $http.post(config.apiUrl + '/keyword_associations', data).success(function(association) {
              verse.keyword_associations.push(association);
              deferred.resolve(1);
            });
          }

          return deferred.promise
      },
      deleteAssociation: function(association) {
          var deferred = $q.defer();
          $http.delete(config.apiUrl + '/keyword_associations/' + association.id).success(function() {
            deferred.resolve(true);
          });
          return deferred.promise;
      },
      canDelete: function(association) {
        var deferred = $q.defer();

        if (!this.isRecent(association)) {
          deferred.resolve(false);
        }

        this.doesIPAddressMatch(association.ip_address).then(function(ipAddressMatches) {
          deferred.resolve(ipAddressMatches);
        });

        return deferred.promise;
      },
      isRecent: function(association) {
        var created = new Date(association.created_at);
        var now = new Date();
        var offset = 9000000; // 15 minutes

        if (now - created < offset) {
          return true;
        }

        return false;
      },
      doesIPAddressMatch: function(ipAddress) {
        var deferred = $q.defer();
        $http.get('http://freegeoip.net/json/').success(function(data) {
            deferred.resolve(data.ip == ipAddress);
        });
        return deferred.promise;
      }
    };
  }

})();