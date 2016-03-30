import angular from 'angular';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import u from 'updeep';
import TodoData from 'apps/todo-data/todo-data.index';
import TodoDataDemo from 'apps/todo-data-demo/todo-data-demo.index';
import {
  TodoListContainer,
  TodoEditor,
} from 'components/todo';

import foundationTodoReducer from './foundation-todo.reducer';

export default angular
  .module('foundationTodo', [
    ngRedux,
    TodoListContainer,
    TodoEditor,
    TodoData,
    TodoDataDemo,
  ])
  .config(setupReduxStore)
  .component('todoApp', {
    templateUrl: require('./todo-app.ngtpl.html')
  })
  .run((TodoDataService) => {
    'ngInject';

    // @NOTE that not providing any argument will not run the function because it's curried
    TodoDataService.getItems({ order: 'desc' });

    setTimeout(() => {
      TodoDataService.addItem({
        title: 'Add a todo item automatically after some delay'
      });
    }, 1000);
  })
;

function setupReduxStore($ngReduxProvider) {
  'ngInject';

  $ngReduxProvider.createStoreWith(
    foundationTodoReducer,
    [
      thunk,
      reduxLogger({
        collapsed: true
      }),
    ]
  );
}
