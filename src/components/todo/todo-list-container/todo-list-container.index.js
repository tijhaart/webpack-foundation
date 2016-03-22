import angular from 'angular';
import component from './todo-list-container.component';
import TodoList from 'components/todo/todo-list/todo-list.index';

export default angular
  .module('TodoListContainer', [
    TodoList,
  ])
  .component('todoListContainer', component)
  .name
;
