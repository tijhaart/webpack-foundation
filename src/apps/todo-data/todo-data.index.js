import angular from 'angular';
import TodoDataService from './todo-data.service';

export default angular
  .module('todo.data', [])
  .service('TodoDataService', TodoDataService)
  .name
;
