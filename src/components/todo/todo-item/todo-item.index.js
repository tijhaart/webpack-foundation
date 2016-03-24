import angular from 'angular';
import TodoEditor from 'components/todo/todo-editor/todo-editor.index';
import component from './todo-item.component';

export default angular
  .module('todo.item', [
    TodoEditor
  ])
  .component('todoItem', component)
  .name
;
