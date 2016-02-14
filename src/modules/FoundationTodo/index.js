import Log from 'components/log/Log';
import TodoList from 'components/todo-list/todo-list.index';
import angular from 'angular';

export default angular.module('FoundationTodo', [TodoList.name])
  .run(() => {
    Log('Running: %s', 'FoundationTodo');
  })
;
