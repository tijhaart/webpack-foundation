import u from 'updeep';
import _ from 'lodash';

export const TODO_ITEM_TOGGLE_COMPLETED = 'TODO_ITEM_TOGGLE_COMPLETED';
export const SAVE_TODO_ITEM = 'SAVE_TODO_ITEM';
export const SAVE_TODO_ITEM_PENDING = 'SAVE_TODO_ITEM_PENDING';
export const SAVE_TODO_ITEM_DONE = 'SAVE_TODO_ITEM_DONE';
export const ADD_TODO_ITEM = 'ADD_TODO_ITEM';
export const ADD_TODO_ITEM_PENDING = 'ADD_TODO_ITEM_PENDING';
export const ADD_TODO_ITEM_DONE = 'ADD_TODO_ITEM_DONE';
export const REMOVE_TODO_ITEM = 'REMOVE_TODO_ITEM';
export const REMOVE_TODO_ITEM_PENDING = 'REMOVE_TODO_ITEM_PENDING';
export const REMOVE_TODO_ITEM_DONE = 'REMOVE_TODO_ITEM_DONE';

export default reducer;
export {
  add,
  save,
  remove
};

function reducer(item, { type, payload }) {
  switch (type) {
    case TODO_ITEM_TOGGLE_COMPLETED:
      if (item.id !== payload.id) {
        return item;
      }

      return u({
        completed: !item.completed
      }, item);

    case SAVE_TODO_ITEM_DONE:
      if (item.id !== payload.id) {
        return item;
      }

      return u(payload, item);

    case ADD_TODO_ITEM_DONE:
      return _createItem(payload);
  }

  return item;
}

// @TODO figure out if this doesn't belong at todo-list[-container] or todo-data app
function add(item) {
  return (dispatch) => {
    dispatch({
      type: ADD_TODO_ITEM_PENDING,
      payload: item
    });

    // @TODO How to use optimistic update here because app 'seems' unresponsive because of the 'server delay'
    setTimeout(() => {
      dispatch({
        type: ADD_TODO_ITEM_DONE,
        payload: u({ updatedAt: new Date().toISOString() }, item),
      });
    }, 300);
  };
}

function save(item) {
  item = _createItem(item);

  return (dispatch) => {
    dispatch({
      type: SAVE_TODO_ITEM_PENDING,
      payload: item
    });

    setTimeout(() => {
      dispatch({
        type: SAVE_TODO_ITEM_DONE,
        payload: u({ updatedAt: new Date().toISOString() }, item),
      });
    }, 300);
  };
}

function remove(id) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TODO_ITEM_PENDING,
      payload: id
    });

    setTimeout(() => {
      dispatch({
        type: REMOVE_TODO_ITEM_DONE,
        payload: id,
      });
    }, 300);
  };
}

function _createItem(item) {
  return u(item, {
    id: _.uniqueId(`$$TodoItem__${_.random()}`),
    title: null,
    completed: false,
    createdAt: new Date().toISOString(),
  });
}
