import _ from 'lodash';
import indexBy from 'lodash.indexby';
import style from './todo-list.local.style.scss';
import classnames from 'classnames';

export default TodoListCtrl;

function TodoListCtrl($scope) {
  console.log('Hello from TodoListCtrl');
  let ctrl = this;

  activate();

  function activate() {
    ctrl.items = getItems();
    ctrl.indexedItems = indexItems(ctrl.items);

    ctrl.toggleDone = toggleDone;
    ctrl.iconClass = iconClass;
  }

  function toggleDone(id) {
    let item = _.get(ctrl.indexedItems, [id]);
    _.set(item, ['completed'], !item.completed);
  }

  function iconClass(completed) {
    return classnames({
      [style.itemIconCompleted]: completed,
      [style.itemIconUncompleted]: !completed,
      'default-class': true
    });
  }

  function getItems() {
    let items = [
      {id: 1, title: 'Finish webpack-foundation', completed: false},
      {id: 2, title: 'Add image loading support', completed: false},
      {id: 3, title: 'Add font loading support', completed: false},
      {id: 4, title: 'Add bower component loading support', completed: false},
    ];

    return items;
  }

  function indexItems(items) {
    return indexBy(items, 'id');
  }
}
