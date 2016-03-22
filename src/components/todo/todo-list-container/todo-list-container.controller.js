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

function map({ todoItems, isFetchingItems }) {
  return {
    isFetchingItems: isFetchingItems,
    items: todoItems,
    // @TODO How to move this to a reducer?
    isTodoItemsEmptyAndNotFetching: !isFetchingItems && todoItems.length < 1,
  };
}
