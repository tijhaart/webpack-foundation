import angular from 'angular';
import component from './todo-list.component';

export default angular
  .module('todo.list', [])
  .component('todoList', component)
  .name
;
