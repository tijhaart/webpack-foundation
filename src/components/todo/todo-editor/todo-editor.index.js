import angular from 'angular';
import todoEditor from './todo-editor.component';

export default angular
  .module('todo.editor', [])
  .component('todoEditor', todoEditor)
  .name
;
