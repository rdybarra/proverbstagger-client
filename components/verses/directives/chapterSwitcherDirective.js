/**
 * chapterSwitcherDirective.js
 *
 * A directive to display a chapter switcher.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .directive('chapterSwitcher', chapterSwitcher);

  function chapterSwitcher() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/views/chapter-form.html',
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
  }

})();