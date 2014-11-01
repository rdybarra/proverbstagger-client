/**
 * SearchController.js
 *
 * Controller for the search box.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .controller('SearchController', [ '$location', SearchController]);

  function SearchController($location) {
    var self = this;
    self.verses = [];

    this.doSearch = function() {
      $location.path('/keyword/' + this.term);
    };
  }

})();