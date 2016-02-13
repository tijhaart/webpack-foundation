import Log from 'components/log/Log';
import angular from 'angular';
import TodoList from 'components/todo-list/todo-list.index';

export default angular.module('FoundationTodo', [TodoList.name])
  .run(() => {
    Log('Running: %s', 'FoundationTodo');
  })
;
