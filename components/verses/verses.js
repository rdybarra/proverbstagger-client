/**
 * Verses.js
 *
 * A module for all things verses.
 */
(function() {
  'use strict';

  angular
    .module('verses', [])
    .value('config', {
      //apiUrl: 'http://localhost:3000/api'
      apiUrl: 'http://api.proverbstagger.com/api'
    });

})();