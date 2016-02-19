import _ from 'lodash';
import style from './todo-list.local.style.scss';
import classnames from 'classnames';

export default TodoListCtrl;

function TodoListCtrl($scope) {
  "ngInject";

  console.log('Hello from TodoListCtrl');
  let ctrl = this;

  activate();

  function activate() {
    ctrl.toggleDone = toggleDone;
    ctrl.iconClass = iconClass;
    ctrl.itemTextClass = itemTextClass;
  }

  function toggleDone(id) {
    console.warn('Temporarily disabled');
    // let item = _.get(ctrl.indexedItems, [id]);
    // !item.disabled && _.set(item, ['completed'], !item.completed);
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
}
