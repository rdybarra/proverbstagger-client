/**
 * keywordOptionsDirective.js
 *
 * A directive to list out and manage the keyword options.
 */
(function() {
  'use strict';

  angular
    .module('verses')
    .directive('keywordOptions', keywordOptions);

  function keywordOptions() {
    return {
      restrict: 'A',
      templateUrl: 'components/verses/views/keyword-options.html',
      controller: function($scope, $http, config, keywordFactory) {
        var self = this;
        this.canDelete = false;
        this.association = {};

        this.setAssociation = function(association) {
          self.association = association;
          return true;
        };

        this.initCanDelete = function() {
          keywordFactory.canDelete(self.association).then(function(canDelete) {
            self.canDelete = true;
            //self.canDelete = canDelete;
          });
        };

        this.delete = function() {
          if (self.canDelete) {
            keywordFactory.deleteAssociation(self.association).then(function(status) {
              $scope.$emit('removeAssociation', self.association);
            });
          }
        };

        this.initCanDelete();
      },
      controllerAs: 'options'
    };
  }

})();