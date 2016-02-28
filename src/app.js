import FoundationTodo from 'modules/FoundationTodo';
import angular from 'angular';

console.log('process.en.NODE_ENV', process.env.NODE_ENV);
console.log('publicPath', __webpack_public_path__);

angular.element(document).ready((event) => {
  angular.bootstrap(document.body, [FoundationTodo.name], {
    // Forces strict dependency injection
    // see: https://docs.angularjs.org/api/ng/function/angular.bootstrap
    strictDi: true
  });
});
