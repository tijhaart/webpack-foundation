import u from 'updeep';

export const GET_TODO_ITEMS_PENDING = 'GET_TODO_ITEMS_PENDING';
export const GET_TODO_ITEMS_DONE = 'GET_TODO_ITEMS_DONE';
export const GET_TODO_ITEMS_ERROR = 'GET_TODO_ITEMS_ERROR';

export function startRequest(query) {
  return {
    type: GET_TODO_ITEMS_PENDING,
    payload: query
  }
}

export function endRequestDone(items) {
  return {
    type: GET_TODO_ITEMS_DONE,
    payload: items,
  };
}

export function fetchTodoItems(query) {
  query = _toQuery(query);

  return (dispatch) => {
    throw Error('"fetchTodoItems" is not implemented');
  };
}

function _toQuery(query) {
  return u(query, {
    limit: 10,
    offset: 0,
    orderProp: 'createdAt',
    order: 'asc'
  });
}
