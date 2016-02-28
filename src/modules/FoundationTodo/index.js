import TodoView from 'views/todo/todo.view.module.js';
import TodoList from 'components/todo-list/todo-list.index';
import angular from 'angular';

export default angular.module('foundationTodo', [
  TodoView.name,
  TodoList.name
]);
