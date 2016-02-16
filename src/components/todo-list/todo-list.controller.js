import _ from 'lodash';
import indexBy from 'lodash.indexby';
import style from './todo-list.local.style.scss';
import classnames from 'classnames';

export default TodoListCtrl;

function TodoListCtrl($scope) {
  "ngInject";

  console.log('Hello from TodoListCtrl');
  let ctrl = this;

  activate();

  function activate() {
    ctrl.items = getItems();
    ctrl.indexedItems = indexItems(ctrl.items);

    ctrl.toggleDone = toggleDone;
    ctrl.iconClass = iconClass;
    ctrl.itemTextClass = itemTextClass;
  }

  function toggleDone(id) {
    let item = _.get(ctrl.indexedItems, [id]);
    !item.disabled && _.set(item, ['completed'], !item.completed);
  }

  function iconClass({completed, disabled}) {
    return classnames({
      'fi-check': !disabled,
      'fi-lock': disabled,
      [style.itemIconCompleted]: completed,
      [style.itemIconUncompleted]: !completed,
      [style.itemIconDisabled]: disabled
    });
  }

  function itemTextClass({completed}) {
    return classnames({[style.itemTextCompleted]: completed});
  }

  function getItems() {
    let items = [
      {id: 1, title: 'Finish webpack-foundation', completed: false, disabled: true},
      {id: 2, title: 'Add image loading support', completed: false, disabled: false},
      {id: 3, title: 'Add font loading support', completed: false, disabled: false},
      {id: 4, title: 'Add bower component loading support', completed: false, disabled: false},
    ];

    return items;
  }

  function indexItems(items) {
    return indexBy(items, 'id');
  }
}
