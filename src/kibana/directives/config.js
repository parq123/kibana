define(function (require) {
  var html = require('text!partials/table.html');
  var _ = require('lodash');
  var ConfigTemplate = require('utils/config_template');

  var module = require('modules').get('kibana/directives');

  /**
   * config directive
   *
   * Creates a full width horizonal config section, usually under a nav/subnav.
   * ```
   * <config config-template="configTemplate" config-object="configurable"></config>
   * ```
   */

  module.directive('config', function ($compile) {
    return {
      restrict: 'E',
      scope: {
        configTemplate: '=',
        configClose: '=',
        configSubmit: '=',
        configObject: '='
      },
      link: function ($scope, element, attr) {
        $scope[attr.configObject] = $scope.configObject;

        $scope.$watch('configTemplate.current || configTemplate', function (newTemplate, oldTemplate) {
          var tmpl = $scope.configTemplate;
          if (tmpl instanceof ConfigTemplate) {
            tmpl = tmpl.toString();
          }

          element.html(!tmpl ? '' : $compile('' +
            '<div class="config" ng-show="configTemplate">' +
            '  <form role="form" class="container-fluid" ng-submit="configSubmit()">' +
              tmpl +
            '  </form>' +
            '  <div class="config-close remove" ng-click="close()">' +
            '    <i class="fa fa-chevron-up"></i>' +
            '  </div>' +
            '</div>' +
            ''
          )($scope));
        });

        $scope.close = function () {
          if (_.isFunction($scope.configClose)) $scope.configClose();
          if ($scope.configTemplate instanceof ConfigTemplate) {
            $scope.configTemplate.current = null;
          } else {
            $scope.configTemplate = null;
          }
        };
      }
    };
  });
});