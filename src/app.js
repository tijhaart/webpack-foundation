// import './app.scss';
import angular from 'angular';
import Log from 'components/log/Log';
import FoundationTodo from 'modules/FoundationTodo';
// import jQuery from 'jquery';

Log('app.js 1');

angular.element(document).ready((event) => {
  angular.bootstrap(document.body, [FoundationTodo.name]);
});
