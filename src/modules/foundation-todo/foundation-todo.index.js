import angular from 'angular';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import _ from 'lodash';

function todoItemsReducer(items=[], action={}) {

  switch (action.type) {
    case 'GET_TODO_ITEMS_DONE':
      return action.payload;
  }

  return items;
}

function isFetchingItemsReducer(isFetching=true, { type }) {
  switch (type) {
    case 'GET_TODO_ITEMS_PENDING':
      return true;
    case 'GET_TODO_ITEMS_DONE':
      return false;
  }

  return isFetching;
}

export default angular
  .module('foundationTodo', [
    ngRedux
  ])
  .config(($ngReduxProvider) => {
    'ngInject';

    const reducer = combineReducers({
      isFetchingItems: isFetchingItemsReducer,
      todoItems: todoItemsReducer
    });

    $ngReduxProvider.createStoreWith(
      reducer,
      [
        thunk,
        reduxLogger(),
      ]
    );
  })
  .run(($rootScope, $ngRedux) => {
    'ngInject';

    const todoItems = [
      { title: 'Add support for large icon buttons with an icon button component', completed: false },
      { title: 'Create a complete todo app', completed: true },
      { title: 'Add support for (mocha) tests' },
      { title: 'Refactor todoApp' },
      { title: 'Split components into seperate component files' }
    ].map((item, index) => {
      item.id = _.uniqueId();
      item.createdAt = new Date(Date.now() + (index * 1000)).toISOString();
      return item;
    });

    $ngRedux.dispatch(fetchTodoItems());

    function fetchTodoItems(query={ limit:10, offset:0 }) {
      return (dispatch) => {
        dispatch({
          type: 'GET_TODO_ITEMS_PENDING',
          payload: query
        });

        setTimeout(() => {
          dispatch({
            type: 'GET_TODO_ITEMS_DONE',
            payload: todoItems
          });
        }, 2000);
      };
    }
  })
  .component('todoApp', {
    templateUrl: require('./todo-app.ngtpl.html')
  })
  .component('todoEditor', {
    templateUrl: require('./todo-app.todo-editor.ngtpl.html')
  })
  .component('todoListContainer', {
    template:`
      <div class="callout" ng-if="ctrl.isFetchingItems">Loading items...</div>
      <todo-list ng-if="!ctrl.isFetchingItems" items="ctrl.items"></todo-list>
    `,
    controller($scope, $ngRedux) {
      'ngInject';
      let ctrl = this;

      const unsubscribe = $ngRedux.connect(map, null)(ctrl);
      $scope.$on('$destroy', unsubscribe);

      function map({ todoItems, isFetchingItems }) {
        return {
          isFetchingItems: isFetchingItems,
          items: todoItems,
        };
      }
    },
    controllerAs: 'ctrl'
  })
  .component('todoList', {
    bindings: {
      items: '<'
    },
    controller() { },
    controllerAs: 'ctrl',
    templateUrl: require('./todo-app.todo-list.ngtpl.html')
  })
  .component('todoItem', {
    bindings: {
      item: '<'
    },
    controller() {},
    controllerAs: 'ctrl',
    templateUrl: require('./todo-app.todo-item.ngtpl.html')
  })
;
