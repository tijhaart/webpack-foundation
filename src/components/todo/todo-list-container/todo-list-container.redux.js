import u from 'updeep';
import _ from 'lodash';
import todoItemReducer, {
  ADD_TODO_ITEM,
  SAVE_TODO_ITEM,
  TODO_ITEM_TOGGLE_COMPLETED,
} from 'components/todo/todo-item/todo-item.redux';

export const GET_TODO_ITEMS_DONE = 'GET_TODO_ITEMS_DONE';
export const TODO_ITEMS_ORDER_BY = 'TODO_ITEMS_ORDER_BY';
export const REMOVE_TODO_ITEM = 'REMOVE_TODO_ITEM';

export default reducer;

function reducer(items=[], action={}) {
  switch (action.type) {
    case GET_TODO_ITEMS_DONE:
      return action.payload;

    case TODO_ITEMS_ORDER_BY:
      const { orderProp, order } = action.payload;
      return _.orderBy(items, [orderProp], [order]);

    // @TODO use normalizr to prevent loops for updating just a single item
    // @link https://github.com/gaearon/normalizr
    case TODO_ITEM_TOGGLE_COMPLETED:
      return u.map((x) => todoItemReducer(x, action), items);

    case ADD_TODO_ITEM:
      return [].concat([todoItemReducer(void(0), action)], items);

    case SAVE_TODO_ITEM:
      return items.map(x => todoItemReducer(x, action));

    case REMOVE_TODO_ITEM:
      const itemId = action.payload;
      return _.filter(items, x => x.id !== itemId);
  }

  return items;
}
