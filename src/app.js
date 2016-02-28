import FoundationTodo from 'modules/FoundationTodo';
import AppConfig from 'config/app-config.index';
import angular from 'angular';

angular.element(document).ready(() => {
  'use strict';
  angular.bootstrap(document.body, [AppConfig.name, FoundationTodo.name], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
