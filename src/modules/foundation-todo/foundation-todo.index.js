import angular from 'angular';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import _ from 'lodash';
import u from 'updeep';
import classNames from 'classnames';

import './todo-item.local.style.scss';

function todoItemReducer(item, { type, payload }) {
  switch (type) {
    case 'TODO_ITEM_TOGGLE_COMPLETED':
      if (item.id !== payload.id) {
        return item;
      }

      return u({
        completed: !item.completed
      }, item);

    case 'ADD_TODO_ITEM':
      return u(payload, {
        id: null,
        title: null,
        completed: false
      });
  }

  return item;
}

function todoItemsReducer(items=[], action={}) {
  switch (action.type) {
    case 'GET_TODO_ITEMS_DONE':
      return action.payload;

    // @TODO use normalizr to prevent loops for updating just a single item
    // @link https://github.com/gaearon/normalizr
    case 'TODO_ITEM_TOGGLE_COMPLETED':
      return u.map((x) => todoItemReducer(x, action), items);

    case 'ADD_TODO_ITEM':
      return [].concat(items, [todoItemReducer(void(0), action)]);
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
      { title: 'Add support for (mocha) tests', completed: false },
      { title: 'Refactor todoApp', completed: false },
      { title: 'Split components into seperate component files', completed: false },
      { title: 'Use normalizr to manage entities like todo items', completed: false },
      { title: 'Fgure out how to use RxJS with angular for input events (e.g. key events)', completed: false },
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
        }, 100);
      };
    }
  })
  .component('todoApp', {
    templateUrl: require('./todo-app.ngtpl.html')
  })
  /**
   * Features:
   * - add new todo item via:
   *   - enter keypress
   *   - 'Add' button
   * - clear input field when text is entered
   */
  .component('todoEditor', {
    templateUrl: require('./todo-app.todo-editor.ngtpl.html'),
    controller($ngRedux) {
      'ngInject';
      const ctrl = this;

      /**
       * mutableItem.title {String}
       */
      ctrl.mutableItem = {};

      ctrl.addTodo = (item) => {
        // ActionCreator side effect
        let nextItem = u(u._, {
          id: _.uniqueId(`$$TodoItem__${_.random()}`),
          title: null,
          completed: false
        });

        item = nextItem(item);

        $ngRedux.dispatch({
          type: 'ADD_TODO_ITEM',
          payload: item
        });
      }

      ctrl.submit = () => {
        if (ctrl.todoItemForm.$invalid) {
          return;
        }

        ctrl.addTodo(ctrl.mutableItem);
        ctrl.reset();
      }

      ctrl.reset = () => {
        ctrl.mutableItem = {};
      }

      // RxJS shines here very well
      // @TODO figure out how to use RxJS with angular
      ctrl.onTitleInputKeyEvent = ({ which: keyCode }) => {
        switch (keyCode) {
          // 13: Enter
          case 13:
            ctrl.submit();
            break;

          // 13: Esc
          case 27:
            ctrl.reset();
            break;
          default:
            return;
        }
      };

      ctrl.classList = {};

      Object.defineProperty(ctrl.classList, 'submitBtn', {
        get() {
          return classNames({
            disabled: ctrl.todoItemForm.$invalid || ctrl.todoItemForm.$pristine
          });
        }
      });
    }
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
    controller($ngRedux) {
      'ngInject';
      const ctrl = this;

      ctrl.toggleCompleted = () => {
        $ngRedux.dispatch({
          type: 'TODO_ITEM_TOGGLE_COMPLETED',
          payload: ctrl.item
        });
      };
    },
    controllerAs: 'ctrl',
    templateUrl: require('./todo-app.todo-item.ngtpl.html')
  })
;
