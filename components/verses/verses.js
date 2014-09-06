(function(){
  var app = angular.module('verses', []);
  var apiUrl = 'http://localhost:3000/api';

  app.controller('ProverbsController', [ '$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    var self = this;
    self.proverbs = [];
    this.chapter = 1;
    this.title = 'Proverbs';

    if ($routeParams.chapter) {
      this.chapter = $routeParams.chapter;
    }
    else {
      this.chapter = new Date().getDate();
    }

    var url = apiUrl + '/chapter/' + this.chapter;
    this.title = 'Proverbs Chapter ' + this.chapter;

    if ($routeParams.keyword) {
      url = apiUrl + '/verses/keyword/' + encodeURIComponent($routeParams.keyword);
      this.title = 'Keyword Results For "' + $routeParams.keyword + '"';
    }

    $http.get(url).success(function(data) {
      self.proverbs = data.verses;
    });

    $scope.$on('removeAssociation', function(event, association) {
      for (var i = self.proverbs.length - 1; i >= 0; i--) {
        var associations = self.proverbs[i].keyword_associations;
        for (var j = associations.length - 1; j >= 0; j--) {
          if (associations[j].id == association.id) {
            self.proverbs[i].keyword_associations.splice(j, 1);
          }
        };
      };
    });

    $scope.$on('switchChapter', function(event, chapterSwitcher) {
      $location.path('/chapter/' + chapterSwitcher.chapter);
    });

  } ]);

  app.controller('KeywordsController', [ '$http', function($http) {
    var self = this;
    self.keywords = [];

    $http.get(apiUrl + '/keywords').success(function(data) {
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
      controller: function($http) {
        this.keyword = {};
        this.association = {};

        this.addAssociation = function(proverb) {
          var unique = true;

          for (var i = 0; i < proverb.keyword_associations.length; i++) {
            if (this.keyword.value == proverb.keyword_associations[i].keyword.value) {
              unique = false;
              var foundAssociation = proverb.keyword_associations[i];

              var data = {
                'verse_id': foundAssociation.verse_id,
                'keyword_id': foundAssociation.keyword_id,
                'count': foundAssociation.count + 1
              };

              $http({ method: 'PATCH', url: apiUrl + '/keyword_associations/' + foundAssociation.id, data: angular.toJson(data)}).success(function(association) {
                foundAssociation.count = association.count;
              });
            }
          };

          if (unique) {
            var data = {
              'verse_id': proverb.id,
              'keyword': this.keyword
            };

            $http.post(apiUrl + '/keyword_associations', data).success(function(association) {
              proverb.keyword_associations.push(association);
            });
          }

          this.keyword = {};
        };
      },
      controllerAs: 'association'
    };
  });

  app.directive('keywordOptions', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/keyword-options.html',
      controller: function($scope, $http) {
          this.canDelete = function(association) {
            //if (association.ip_address == '127.0.0.1' && ''
            
            var created = new Date(association.created_at);
            var now = new Date();
            var offset = 108000000; // 15 minutes

            if (now - created < offset) {
              return true;
            }

            return false;
          };

          this.delete = function(association) {

            $http.delete(apiUrl + '/keyword_associations/' + association.id).success(function() {
              $scope.$emit('removeAssociation', association);
            });

          }
      },
      controllerAs: 'options'
    };
  });

  app.directive('chapterSwitcher', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/chapter-form.html',
      controller: function($scope, $routeParams) {
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
            $scope.$emit('switchChapter', self);
          };
      },
      controllerAs: 'switcher'
    };
  });

})();