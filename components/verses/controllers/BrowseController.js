/**
 * BrowseController.js
 *
 * Controller used in the browsing of keywords.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .controller('BrowseController', [ '$http', 'config', BrowseController]);

  function BrowseController($http, config) {
    var self = this;
    self.keywords = [];

    $http.get(config.apiUrl + '/keywords').success(function(data) {
      self.keywords = data
    });
  }

})();