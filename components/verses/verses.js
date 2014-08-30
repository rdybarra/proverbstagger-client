(function(){
  var app = angular.module("verses", []);

  app.controller("ProverbsController", [ '$http', function($http) {
    var self = this;
    self.proverbs = [];

    $http.get('http://localhost:3000/api/chapter/1').success(function(data) {
      self.proverbs = data.verses;
    });

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

          for (var i = proverb.keyword_associations.length - 1; i >= 0; i--) {
            if (this.keyword.value == proverb.keyword_associations[i].keyword.value) {
              proverb.keyword_associations[i].count += 1;
              unique = false;
            }
          };

          if (unique) {
            this.association.keyword = this.keyword;
            this.association.count = 1;
            proverb.keyword_associations.push(this.association);
          }

          var data = {
            'keyword': this.keyword
          };

          $http.put('http://localhost:3000/api/verse/' + proverb.id, data).success(function(data) {
            console.log('saved');
          });

          this.keyword = {};
        };
      },
      controllerAs: 'association'
    };
  });

})();