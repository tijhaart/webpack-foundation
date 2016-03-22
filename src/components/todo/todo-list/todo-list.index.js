import angular from 'angular';
import component from './todo-list.component';

export default angular
  .module('TodoList', [])
  .component('todoList', component)
  .name
;
