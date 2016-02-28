import style from './todo-list.local.style.scss';
import classnames from 'classnames';

export default TodoListCtrl;

function TodoListCtrl() {
  'ngInject';

  console.log('Hello from TodoListCtrl');
  let ctrl = this;

  activate();

  function activate() {
    ctrl.toggleDone = toggleDone;
    ctrl.iconClass = iconClass;
    ctrl.itemTextClass = itemTextClass;
  }

  function toggleDone() {
    console.warn('[toggleDone Temporarily disabled');
  }

  function iconClass({ completed, disabled }) {
    return classnames({
      'fi-check': !disabled,
      'fi-lock': disabled,
      [style.itemIconCompleted]: completed,
      [style.itemIconUncompleted]: !completed,
      [style.itemIconDisabled]: disabled
    });
  }

  function itemTextClass({ completed }) {
    return classnames({ [style.itemTextCompleted]: completed });
  }
}
