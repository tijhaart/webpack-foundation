import Rx from 'rx';
import _ from 'lodash';
import u from 'updeep';
import angular from 'angular';
import classNames from 'classnames';

export default class TodoEditorController {
  constructor($ngRedux, $element, $scope, TodoDataService) {
    'ngInject';

    const ctrl = this;

    activate();

    function activate() {
      // @TODO use ctrl.setState
      ctrl.state = {
        isContentEditable: !!ctrl.isContentEditable,
        isNewItem: !!ctrl.isNewItem,
        isFocused: false,
      };
      ctrl.mutableItem = angular.copy(ctrl.item || {});
      ctrl.classList = {};

      handleInputEvents();
      handleClasslists();
    }

    ctrl.saveTodo = _.curry(_saveTodo)({ $ngRedux, ctrl, TodoDataService });
    ctrl.remove = () => _remove({ TodoDataService, ctrl });

    ctrl.onTitleInputKeyEvent = _.curry(_onTitleInputKeyEvent)({ ctrl });

    function handleInputEvents() {
      const onInputFocus$ = Rx.Observable.fromEvent($element.find('input'), 'focus blur');

      const observer = onInputFocus$
        // @TODO Implement ctrl.setState
        .map(({type}) => {
          return u({
            isFocused: type === 'focus'
          }, ctrl.state);
        })
        .do((x) => {
          ctrl.state = x;
        })
        .do(() => {
          $scope.$digest();
        })
        .subscribe()
      ;

      $scope.$on('$destroy', observer.dispose.bind(observer));
    }

    function handleClasslists() {
      Object.defineProperty(ctrl.classList, 'submitBtn', {
        get: () => classNames({
          'disabled _is_disabled': ctrl.todoItemForm.$invalid || ctrl.todoItemForm.$pristine
        })
      });

      Object.defineProperty(ctrl.classList, 'clearBtn', {
        get: () => classNames({
          'disabled _is_disabled': ctrl.todoItemForm.$pristine || _.isEmpty(ctrl.mutableItem.title)
        })
      });

      Object.defineProperty(ctrl.classList, 'removeBtn', {
        get: () => classNames({
          '_is_hidden': !ctrl.state.isFocused
        })
      });
    }
  }

  submit() {
    const ctrl = this;

    if (ctrl.todoItemForm.$invalid) {
      // @TODO Inform user
      return;
    }

    ctrl.saveTodo(ctrl.mutableItem);
    ctrl.reset();
  }

  reset() {
    const ctrl = this;
    // reset field when not saving an existing item
    if (!ctrl.item) {
      ctrl.mutableItem = {};
    }
  }
}

function _onTitleInputKeyEvent({ ctrl }, { which: keyCode, type }) {
  const actions = {
    // 13: Enter
    13: ctrl.submit,
    // 27: Esc
    27: ctrl.reset
  };

  const action = actions[keyCode];
  action && action.call(ctrl);
}

function _saveTodo({ $ngRedux, ctrl, TodoDataService }, item) {

  const { ordering: todoItemsOrdering } = $ngRedux.getState().todos;

  if (ctrl.isNewItem) {
    TodoDataService.addItem(item);
  } else {
    TodoDataService.saveItem(item);
  }

  // @NOTE Should middleware be responsible for reordering?
  const { orderProp, order } = todoItemsOrdering;
  $ngRedux.dispatch({
    type: 'TODO_ITEMS_ORDER_BY',
    payload: { orderProp, order }
  });
}

function _remove({ TodoDataService, ctrl }) {
  TodoDataService.removeItem(
    ctrl.mutableItem.id || ctrl.item.id
  );
}
