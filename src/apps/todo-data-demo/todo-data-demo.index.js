import _ from 'lodash';
import u from 'updeep';
import angular from 'angular';
import {
  startRequest,
  endRequestDone,
} from 'apps/todo-data/todo-data.actions';

import { getItems } from './data';

const allItems = getItems();

export default angular
  .module('todo.dataDemo', [])
  .config(($provide) => {
    'ngInject';

    $provide.decorator('TodoDataService', TodoDataServiceDecorator);
  })
  .name
;

function TodoDataServiceDecorator($delegate, $ngRedux) {
  'ngInject';

  $delegate.getItems = getItems;

  return $delegate;

  function getItems(query) {
    query = u(query, {
      limit: 10,
      offset: 0,
      orderProp: 'createdAt',
      order: 'asc'
    });

    const { orderProp, order, offset, limit } = query;
    const items = _.orderBy(allItems, [orderProp], [order]).slice(
      offset,
      limit
    );

    return $ngRedux.dispatch(_.curry(_fetchTodoItems)({ query, items }));
  }
}

function _fetchTodoItems({ query, items }, dispatch) {
  dispatch(startRequest(query));

  setTimeout(function() {
    dispatch(endRequestDone(items));
  }, 500);
}
