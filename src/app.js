import FoundationTodo from 'modules/FoundationTodo';
import angular from 'angular';

angular.element(document).ready(() => {
  'use strict';
  angular.bootstrap(document.body, [FoundationTodo.name], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
