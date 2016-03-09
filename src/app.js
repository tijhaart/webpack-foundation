import angular from 'angular';
import foundationTodo from './modules/foundation-todo/foundation-todo.index';

angular.element(document).ready(() => {
  'use strict';
  angular.bootstrap(document.body, [
    foundationTodo.name
  ], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
