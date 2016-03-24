import angular from 'angular';
import TodoItem from 'components/todo/todo-item/todo-item.index';
import component from './todo-list.component';

export default angular
  .module('todo.list', [
    TodoItem
  ])
  .component('todoList', component)
  .name
;
