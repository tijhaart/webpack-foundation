export default class todoListContainerCtrl {
  constructor($scope, $ngRedux) {
    'ngInject';

    const ctrl = this;

    $scope.$on(
      '$destroy',
      // connect returns an unsubscribe handler
      $ngRedux.connect(map, null)(ctrl)
    );
  }
}

function map({ todos }) {
  return {
    isFetchingItems: todos.isFetching,
    items: todos.items,
    isTodoItemsEmptyAndNotFetching: !todos.isFetching && todos.items.length < 1,
  };
}
