import './todo-item.local.style.scss';
import TodoItemCtrl from './todo-item.controller';
import templateUrl from './todo-item.ngtpl.html';

const component = {
  bindings: {
    item: '<'
  },
  controller: TodoItemCtrl,
  templateUrl: templateUrl,
};

export default component;
