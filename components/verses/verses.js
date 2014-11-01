(function(){
  var app = angular.module('verses', []);

  app.value('config', {
    apiUrl: 'http://localhost:3000/api'
  });

  app.factory('versesFactory', ['$http', '$q', 'config', function ($http, $q, config) {
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
  } ]);

  app.factory('keywordFactory', ['$http', '$q', 'config', function($http, $q, config) {
    return {
      addAssociation: function(verse, keyword) {
          var deferred = $q.defer();
          var unique = true;
console.log(verse);
          for (var i = 0; i < verse.keyword_associations.length; i++) {
            console.log(keyword);
            if (keyword.value == verse.keyword_associations[i].keyword.value) {
              unique = false;
              var foundAssociation = verse.keyword_associations[i];

              var data = {
                'verse_id': foundAssociation.verse_id,
                'keyword_id': foundAssociation.keyword_id,
                'count': foundAssociation.count + 1
              };
console.log('here');
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
console.log('no he');
            $http.post(config.apiUrl + '/keyword_associations', data).success(function(association) {
              verse.keyword_associations.push(association);
              deferred.resolve(1);
            });
          }

          return deferred.promise
      }
    };
  } ]);

  app.controller('VersesController', [ '$scope', '$http', '$routeParams', 'versesFactory', function($scope, $http, $routeParams, versesFactory) {
    var self = this;
    self.verses = [];
    this.chapter = 1;
    this.title = 'Proverbs';

    if ($routeParams.keyword) {
      this.title = 'Keyword Results For "' + $routeParams.keyword + '"';
      versesFactory.getVersesByKeyword($routeParams.keyword).then(function(verses) {
        self.verses = verses;
      });
    }
    else {
      if ($routeParams.chapter) {
        this.chapter = $routeParams.chapter;
      }
      else {
        this.chapter = new Date().getDate();
      }
      this.title = 'Proverbs Chapter ' + this.chapter;
      versesFactory.getVersesByChapter(this.chapter).then(function(verses) {
        self.verses = verses;
      });
    }

    $scope.$on('removeAssociation', function(event, association) {
      for (var i = self.verses.length - 1; i >= 0; i--) {
        var associations = self.verses[i].keyword_associations;
        for (var j = associations.length - 1; j >= 0; j--) {
          if (associations[j].id == association.id) {
            self.verses[i].keyword_associations.splice(j, 1);
          }
        };
      };
    });

  } ]);

  app.controller('KeywordsController', [ '$http', function($http, config) {
    var self = this;
    self.keywords = [];

    $http.get(config.apiUrl + '/keywords').success(function(data) {
      self.keywords = data
    });

  } ]);

  app.controller('SearchController', [ '$location', function($location) {

    var self = this;
    self.verses = [];

    this.doSearch = function() {
      $location.path('/keyword/' + this.term);
    };

  } ]);

  app.directive('keywordForm', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/keyword-form.html',
      controller: function($http, config, keywordFactory) {
        var self = this;
        this.keyword = {};
        this.association = {};

        this.addAssociation = function(verse) {

          keywordFactory.addAssociation(verse, this.keyword).then(function() {
            // Clear the form
            self.keyword = {};
          });

        };
      },
      controllerAs: 'association'
    };
  });

  app.directive('keywordOptions', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/keyword-options.html',
      controller: function($scope, $http, config) {
        var self = this;
        this.canDelete = false;
        this.association = {};

        this.setAssociation = function(association) {
          self.association = association;
          return true;
        }

        this.isRecent = function() {
          var created = new Date(self.association.created_at);
          var now = new Date();
          var offset = 9000000; // 15 minutes

          if (now - created < offset) {
            return true;
          }

          return false;
        };

        this.delete = function() {
          $http.delete(config.apiUrl + '/keyword_associations/' + self.association.id).success(function() {
            $scope.$emit('removeAssociation', self.association);
          });
        };

        this.getIPAddress = function() {
          $http.get('http://freegeoip.net/json/').success(function(data) {
            if (self.isRecent() && data.ip == self.association.ip_address) {
              self.canDelete = true;
            }
          });
        };

        this.isRecent();
        this.getIPAddress();
      },
      controllerAs: 'options'
    };
  });

  app.directive('chapterSwitcher', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/chapter-form.html',
      controller: function($scope, $routeParams, $location) {
          var self = this;

          if ($routeParams.chapter) {
            this.chapter = $routeParams.chapter;
          }
          else if ($routeParams.keyword) {
            this.chapter = '';
          }
          else {
            this.chapter = new Date().getDate();
          }

          this.switchChapter = function() {
            $location.path('/chapter/' + this.chapter);
          };
      },
      controllerAs: 'switcher'
    };
  });

})();