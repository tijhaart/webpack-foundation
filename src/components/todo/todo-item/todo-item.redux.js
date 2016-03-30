import u from 'updeep';
import _ from 'lodash';

export const TODO_ITEM_TOGGLE_COMPLETED = 'TODO_ITEM_TOGGLE_COMPLETED';
export const SAVE_TODO_ITEM = 'SAVE_TODO_ITEM';
export const ADD_TODO_ITEM = 'ADD_TODO_ITEM';

export default reducer;
export {
  add
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

    case SAVE_TODO_ITEM:
      if (item.id !== payload.id) {
        return item;
      }

      return u(payload, item);

    case ADD_TODO_ITEM:
      return _createItem(payload);
  }

  return item;
}

// @TODO figure out if this doesn't belong at todo-list[-container] or todo-data app
function add(item) {
  item = _createItem(item);

  return {
    type: 'ADD_TODO_ITEM',
    payload: item,
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
