import _ from 'lodash';
import u from 'updeep';
import {
  fetchTodoItems
} from './todo-data.actions';

export default class TodoDataService {
  constructor($http, $ngRedux) {
    'ngInject';

    const ctrl = this;

    ctrl.getItems = _.curry(_getItems)({ $ngRedux });
  }
}

function _getItems({ $ngRedux }, query) {
  $ngRedux.dispatch(fetchTodoItems(query));
}
