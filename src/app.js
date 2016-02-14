import Log from 'components/log/Log';
import FoundationTodo from 'modules/FoundationTodo';
import angular from 'angular';

angular.element(document).ready((event) => {
  angular.bootstrap(document.body, [FoundationTodo.name]);
});
