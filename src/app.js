import FoundationTodo from 'modules/FoundationTodo';
import AppConfig from 'config/app-config.index';
import angular from 'angular';

import ngReduxSpike from 'modules/ng-redux-spike';

angular.element(document).ready(() => {
  'use strict';
  angular.bootstrap(document.body, [AppConfig.name, FoundationTodo.name, ngReduxSpike.name], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
