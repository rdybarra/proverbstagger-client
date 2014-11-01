/**
 * VersesController.js
 *
 * Controller for verses.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .controller('VersesController', ['$scope', '$http', '$routeParams', 'verseFactory', VersesController]);

  function VersesController($scope, $http, $routeParams, verseFactory) {
    var self = this;
    self.verses = [];
    this.chapter = 1;
    this.title = 'Proverbs';

    if ($routeParams.keyword) {
      this.title = 'Keyword Results For "' + $routeParams.keyword + '"';
      verseFactory.getVersesByKeyword($routeParams.keyword).then(function(verses) {
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
      verseFactory.getVersesByChapter(this.chapter).then(function(verses) {
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
  }

})();