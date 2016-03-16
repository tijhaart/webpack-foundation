import angular from 'angular';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import _ from 'lodash';
import u from 'updeep';
import classNames from 'classnames';
import Rx from 'rx';

import './todo-item.local.style.scss';
import './todo-editor.local.style.scss';

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
      return [].concat([todoItemReducer(void(0), action)], items);

    case 'REMOVE_TODO_ITEM':
      const itemId = action.payload;
      return _.filter(items, x => x.id !== itemId);

    case 'TODO_ITEMS_ORDER_BY':
      const { orderProp, order } = action.payload;
      return _.orderBy(items, [orderProp], [order]);
  }

  return items;
}

function isFetchingItemsReducer(isFetching=false, { type }) {
  switch (type) {
    case 'GET_TODO_ITEMS_PENDING':
      return true;
    case 'GET_TODO_ITEMS_DONE':
      return false;
  }

  return isFetching;
}

function todoItemsOrdering(ordering = { orderProp: 'createdAt', order: 'desc' }, { type, payload }) {
  switch (type) {
    case 'TODO_ITEMS_ORDER_BY':
      return u({
        orderProp: payload.orderProp,
        order: payload.order,
      }, ordering);
  }

  return ordering;
}

export default angular
  .module('foundationTodo', [
    ngRedux
  ])
  .config(($ngReduxProvider) => {
    'ngInject';

    const reducer = combineReducers({
      isFetchingItems: isFetchingItemsReducer,
      todoItems: todoItemsReducer,
      todoItemsOrdering: todoItemsOrdering,
    });

    $ngReduxProvider.createStoreWith(
      reducer,
      [
        thunk,
        reduxLogger({
          collapsed: true
        }),
      ]
    );
  })
  .run(($rootScope, $ngRedux) => {
    'ngInject';

    const todoItems = [
      { title: 'Add new todo item', completed: true },
      { title: 'Prevent adding new todo when input field is empty', completed: true },
      { title: 'Disable "Add" button when input is invalid', completed: true },
      { title: 'Add new todo by pressing ENTER', completed: true },
      { title: 'Clear todo item input field by pressing ESC', completed: true },
      { title: 'Clear todo item input field by clicking the "clear" button', completed: true },
      { title: 'Add new todo items on top of the list (order by createdAt)', completed: true },
      { title: 'Remove todo item', completed: true },
      { title: 'Edit todo item title', completed: false },
      { title: 'Add support for large icon buttons with an icon button component', completed: false },
      { title: 'Create a complete todo app', completed: false },
      { title: 'Display a message when a todo was added', completed: false },
      { title: 'Add support for (mocha) tests', completed: false },
      { title: 'Refactor todoApp', completed: false },
      { title: 'Split components into seperate component files', completed: false },
      { title: 'Use normalizr to manage entities like todo items', completed: false },
      { title: 'Fgure out how to use RxJS with angular for input events (e.g. key events)', completed: false },
      { title: 'Use a remote api that serves fake (generated) data using json-schema-faker', completed: false },
      { title: 'Persist changes to the todo items', completed: false },
      { title: 'Group list into uncompleted and completed', completed: false },
      { title: 'Research angularjs + redux + time travel', completed: false },
      { title: 'Try out lodash/fp, because fp :P', completed: false },
    ].map((item, index) => {
      item.id = _.uniqueId();
      item.createdAt = new Date(Date.now() + (index * 1000)).toISOString();
      return item;
    });

    $ngRedux.dispatch(fetchTodoItems({order: 'desc'}));

    function fetchTodoItems(query={}) {
      query = u(query, {
        limit: 10,
        offset: 0,
        orderProp: 'createdAt',
        order: 'asc'
      });

      return (dispatch) => {
        dispatch({
          type: 'GET_TODO_ITEMS_PENDING',
          payload: query
        });

        setTimeout(() => {
          const { orderProp, order, offset, limit } = query;
          // todoItemsOrdered simulates the ordered, queried, result from a remote source
          const todoItemsOrdered = _.orderBy(todoItems, [orderProp], [order]).slice(
            offset,
            limit
          );

          dispatch({
            type: 'GET_TODO_ITEMS_DONE',
            payload: todoItemsOrdered,
          });
        }, 100);
      };
    }

    setTimeout(() => {
      $ngRedux.dispatch({
        type: 'ADD_TODO_ITEM',
        payload: {
          id: _.uniqueId(`$$TodoItem__${_.random()}`),
          title: 'Delayed automatically added todo item',
          completed: false,
          createdAt: new Date().toISOString(),
        }
      });
    }, 1000);
  })
  .component('todoApp', {
    templateUrl: require('./todo-app.ngtpl.html')
  })
  .component('todoEditor', {
    bindings: {
      item: '<',
      edit: '=',
    },
    templateUrl: require('./todo-app.todo-editor.ngtpl.html'),
    controller($ngRedux, $element, $scope) {
      'ngInject';
      const ctrl = this;

      ctrl.state = {
        isFocused: false
      };

      const onInputFocus$ = Rx.Observable.fromEvent($element.find('input'), 'focus blur');

      const unsubscribe = onInputFocus$
        // @TODO Implement ctrl.setState
        .map(({type}) => {
          return u({
            isFocused: type === 'focus'
          }, ctrl.state);
        })
        .do((x) => {
          ctrl.state = x;
        })
        .do(() => {
          $scope.$digest();
        })
        .subscribe()
      ;

      $scope.$on('$destroy', unsubscribe);

      /**
       * mutableItem.title {String}
       */
      ctrl.mutableItem = {};

      if (ctrl.edit) {
        ctrl.mutableItem = angular.copy(ctrl.item);
      }

      ctrl.saveTodo = (item) => {
        // ActionCreator side effect
        let nextItem = u(u._, {
          id: _.uniqueId(`$$TodoItem__${_.random()}`),
          title: null,
          completed: false,
          createdAt: new Date().toISOString()
        });

        const { todoItemsOrdering } = $ngRedux.getState();

        item = nextItem(item);

        if (ctrl.edit) {
          $ngRedux.dispatch({
            type: 'SAVE_TODO_ITEM',
            payload: item
          });
        } else {
          $ngRedux.dispatch({
            type: 'ADD_TODO_ITEM',
            payload: item
          });
        }

        const { orderProp, order } = todoItemsOrdering;
        $ngRedux.dispatch({
          type: 'TODO_ITEMS_ORDER_BY',
          payload: { orderProp, order }
        });
      };

      ctrl.submit = () => {
        if (ctrl.todoItemForm.$invalid) {
          return;
        }

        ctrl.saveTodo(ctrl.mutableItem);
        ctrl.reset();
      }

      ctrl.reset = () => {
        if (ctrl.edit) {
          ctrl.mutableItem = angular.copy(ctrl.item);
        } else {
          ctrl.mutableItem = {};
        }
      }

      // RxJS shines here very well
      // @TODO figure out how to use RxJS with angular
      ctrl.onTitleInputKeyEvent = ({ which: keyCode }) => {
        const actions = {
          // 13: Enter
          13: ctrl.submit,
          // 13: Esc
          27: ctrl.reset
        };

        const action = actions[keyCode];
        action && action();
      };

      ctrl.classList = {};

      Object.defineProperty(ctrl.classList, 'submitBtn', {
        get: () => classNames({
          disabled: ctrl.todoItemForm.$invalid || ctrl.todoItemForm.$pristine
        })
      });

      Object.defineProperty(ctrl.classList, 'clearBtn', {
        get: () => classNames({
          disabled: ctrl.todoItemForm.$pristine || _.isEmpty(ctrl.mutableItem.title)
        })
      });
    }
  })
  .component('todoListContainer', {
    template:`
      <div class="callout" ng-if="ctrl.isFetchingItems">Loading items...</div>
      <div class="callout" ng-if="ctrl.isTodoItemsEmptyAndNotFetching">Nothing to see here. Move along.</div>
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
          // @TODO How to move this to a reducer?
          isTodoItemsEmptyAndNotFetching: !isFetchingItems && todoItems.length < 1,
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

      ctrl.toggleCompleted = (event) => {
        event.preventDefault();
        toggleCompleted();
      };

      ctrl.remove = (event) => {
        event.preventDefault();

        $ngRedux.dispatch({
          type: 'REMOVE_TODO_ITEM',
          payload: ctrl.item.id
        });
      };

      function toggleCompleted() {
        $ngRedux.dispatch({
          type: 'TODO_ITEM_TOGGLE_COMPLETED',
          payload: ctrl.item
        });
      }
    },
    templateUrl: require('./todo-app.todo-item.ngtpl.html')
  })
;
