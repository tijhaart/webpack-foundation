import angular from 'angular';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import _ from 'lodash';
import u from 'updeep';
import classNames from 'classnames';
import Rx from 'rx';

import {
  TodoListContainer,
  TodoEditor,
} from 'components/todo';

function todoItemReducer(item, { type, payload }) {
  switch (type) {
    case 'TODO_ITEM_TOGGLE_COMPLETED':
      if (item.id !== payload.id) {
        return item;
      }

      return u({
        completed: !item.completed
      }, item);

    case 'SAVE_TODO_ITEM':
      if (item.id !== payload.id) {
        return item;
      }

      console.log(item.title);

      return u(payload, item);

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

    case 'SAVE_TODO_ITEM':
      return items.map(x => todoItemReducer(x, action));

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
    ngRedux,
    TodoListContainer,
    TodoEditor,
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
      { title: 'Edit todo item title', completed: true },
      { title: 'Fix inline editing', completed: false },
      { title: 'Add support for large icon buttons with an icon button component', completed: false },
      { title: 'Create a complete todo app', completed: false },
      { title: 'Display a message when a todo was added', completed: false },
      { title: 'Add support for running (mocha) tests', completed: false },
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
      item.createdAt = new Date(Date.now() - (index * 1000)).toISOString();
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
  // .component('todoItem', {
  //   bindings: {
  //     item: '<'
  //   },
  //   controller($ngRedux) {
  //     'ngInject';
  //     const ctrl = this;
  //
  //     ctrl.toggleCompleted = (event) => {
  //       event.preventDefault();
  //       toggleCompleted();
  //     };
  //
  //     ctrl.remove = (event) => {
  //       event.preventDefault();
  //
  //       $ngRedux.dispatch({
  //         type: 'REMOVE_TODO_ITEM',
  //         payload: ctrl.item.id
  //       });
  //     };
  //
  //     function toggleCompleted() {
  //       $ngRedux.dispatch({
  //         type: 'TODO_ITEM_TOGGLE_COMPLETED',
  //         payload: ctrl.item
  //       });
  //     }
  //   },
  //   templateUrl: require('./todo-app.todo-item.ngtpl.html')
  // })
;
