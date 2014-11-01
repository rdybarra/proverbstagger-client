/**
 * keywordFormDirective.js
 *
 * A directive to display a keyword form.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .directive('keywordForm', keywordForm);

  function keywordForm() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/views/keyword-form.html',
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
  }

})();