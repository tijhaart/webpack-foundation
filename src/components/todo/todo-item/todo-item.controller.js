export default class TodoItemCtrl {
  constructor($ngRedux) {
    'ngInject';

    const ctrl = this;

    ctrl.toggleCompleted = (event) => {
      event.preventDefault();
      toggleCompleted();
    };

    ctrl.remove = (event) => {
      event.preventDefault();

      $ngRedux.dispatch({
        type: 'REMOVE_TODO_ITEM',
        payload: ctrl.item.id
      });
    };

    function toggleCompleted() {
      $ngRedux.dispatch({
        type: 'TODO_ITEM_TOGGLE_COMPLETED',
        payload: ctrl.item
      });
    }
  }
}
