(function(){
  var app = angular.module("verses", []);

  app.controller("ProverbsController", [ '$http', function($http) {
    var self = this;
    self.proverbs = [];

    $http.get('data/proverbs1.json').success(function(data) {
      self.proverbs = data;
    });

  } ]);

  app.directive('keywordForm', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/templates/keyword-form.html',
      controller: function() {

        this.keyword = {};

        this.addKeyword = function(proverb) {
          var unique = true;

          for (var i = proverb.keywords.length - 1; i >= 0; i--) {
            if (this.keyword.value == proverb.keywords[i].value) {
              proverb.keywords[i].count += 1;
              unique = false;
            }
          };

          if (unique) {
            this.keyword.count = 1;
            proverb.keywords.push(this.keyword);
          }

          this.keyword = {};
        };
      },
      controllerAs: 'keyword'
    };
  });

})();