import _ from 'lodash';
import u from 'updeep';
import {
  fetchTodoItems
} from './todo-data.actions';
import {
  add as addItem
} from 'components/todo/todo-item/todo-item.redux';

export default class TodoDataService {
  constructor($http, $ngRedux) {
    'ngInject';

    const ctrl = this;

    ctrl.getItems = _.curry(_getItems)({ $ngRedux });
    ctrl.addItem = _.curry(_addItem)({ $ngRedux });
  }
}

function _getItems({ $ngRedux }, query) {
  $ngRedux.dispatch(fetchTodoItems(query));
}

function _addItem({ $ngRedux }, item) {
  $ngRedux.dispatch(addItem(item));
}
