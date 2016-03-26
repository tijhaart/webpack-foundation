import angular from 'angular';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import ngRedux from 'ng-redux';
import reduxLogger from 'redux-logger';
import _ from 'lodash';
import u from 'updeep';
import classNames from 'classnames';
import Rx from 'rx';

import TodoData from 'apps/todo-data/todo-data.index';

import TodoDataDemo from 'apps/todo-data-demo/todo-data-demo.index';

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
    case 'GET_TODO_ITEMS_ERROR':
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
    TodoData,
    TodoDataDemo,
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
  .run((TodoDataService) => {
    'ngInject';

    // empty object because it's curried (@TODO how to prevent usage of empty object?)
    TodoDataService.getItems({ order: 'desc' });
  })
  .run(($rootScope, $ngRedux) => {
    'ngInject';

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
;
