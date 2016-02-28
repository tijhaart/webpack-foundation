import angular from 'angular';
import TodoViewCtrl from './todo.view.controller';
import './index.ngtpl.html';

export default angular.module('views.todo', [])
  .controller('TodoViewCtrl', TodoViewCtrl)
;
