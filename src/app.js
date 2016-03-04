// import AppConfig from 'config/app-config.index';
import angular from 'angular';

import ngUIRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import ngReduxRouter from 'redux-ui-router';
import {
  router,
  stateGo,
  stateReload,
  stateTransitionTo
} from 'redux-ui-router';

const ngModule = angular
  .module('foundationTodo', [
    ngUIRouter,
    ngRedux,
    ngReduxRouter
  ])
  .config(function($ngReduxProvider) {
    'ngInject';

    const logger = createLogger({
      level: 'info',
      collapsed: true
    });

    const reducers = combineReducers({
      router
    });

    $ngReduxProvider.createStoreWith(
      reducers,
      [
        'ngUiRouterMiddleware',
        logger,
        thunk
      ]
    );
  })
;

// import './modules/ng-redux-spike';

angular.element(document).ready(() => {
  'use strict';
  angular.bootstrap(document.body, [
    'foundationTodo'
    // 'ngReduxSpike'
  ], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
