import todoItemReducer, * as todoItemActions from 'components/todo/todo-item/todo-item.redux';
import todoItemsReducer from 'components/todo/todo-list-container/todo-list-container.redux';
import { combineReducers } from 'redux';
import u from 'updeep';

export default combineReducers({
  todos: combineReducers({
    isFetching: isFetchingItemsReducer,
    ordering: todoItemsOrdering,
    items: todoItemsReducer
  })
});

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
