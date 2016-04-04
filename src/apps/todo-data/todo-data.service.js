import _ from 'lodash';
import u from 'updeep';
import {
  fetchTodoItems
} from './todo-data.actions';
import {
  add as addItem,
  save as saveItem,
  remove as removeItem
} from 'components/todo/todo-item/todo-item.redux';

export default class TodoDataService {
  constructor($http, $ngRedux) {
    'ngInject';

    const ctrl = this;

    ctrl.getItems = _.curry(_getItems)({ $ngRedux });
    ctrl.addItem = _.curry(_addItem)({ $ngRedux });
    ctrl.saveItem = _.curry(_saveItem)({ $ngRedux });
    ctrl.removeItem = _.curry(_removeItem)({ $ngRedux });
  }
}

function _getItems({ $ngRedux }, query) {
  $ngRedux.dispatch(fetchTodoItems(query));
}

function _addItem({ $ngRedux }, item) {
  $ngRedux.dispatch(addItem(item));
}

function _saveItem({ $ngRedux }, item) {
  $ngRedux.dispatch(saveItem(item));
}

function _removeItem({ $ngRedux }, id) {
  $ngRedux.dispatch(removeItem(id));
}
