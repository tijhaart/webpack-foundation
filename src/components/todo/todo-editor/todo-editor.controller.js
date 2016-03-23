import Rx from 'rx';
import _ from 'lodash';
import u from 'updeep';
import angular from 'angular';
import classNames from 'classnames';

export default class TodoEditorController {
  constructor($ngRedux, $element, $scope) {
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

      handleInputEvents();

      ctrl.classList = {};

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

    ctrl.saveTodo = _.curry(_saveTodo)({ $ngRedux, ctrl });
    // ctrl.remove = _.curry(_remove)(_, { $ngRedux, ctrl });

    ctrl.onTitleInputKeyEvent = _.curry(_onTitleInputKeyEvent)({ ctrl });

    ctrl.remove = () => {
      $ngRedux.dispatch({
        type: 'REMOVE_TODO_ITEM',
        payload: ctrl.mutableItem.id || ctrl.item.id,
      });
    };

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
    ctrl.mutableItem = angular.copy(ctrl.item || {});
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

 function _saveTodo({$ngRedux, ctrl }, item) {
  // ActionCreator side effect
  let nextItem = u(u._, {
    id: _.uniqueId(`$$TodoItem__${_.random()}`),
    title: null,
    completed: false,
    createdAt: new Date().toISOString()
  });

  const { todoItemsOrdering } = $ngRedux.getState();

  if (ctrl.isNewItem) {
    $ngRedux.dispatch({
      type: 'ADD_TODO_ITEM',
      payload: nextItem(item)
    });
  } else {
    $ngRedux.dispatch({
      type: 'SAVE_TODO_ITEM',
      payload: item
    });
  }

  const { orderProp, order } = todoItemsOrdering;
  $ngRedux.dispatch({
    type: 'TODO_ITEMS_ORDER_BY',
    payload: { orderProp, order }
  });
}

function _remove({ $ngRedux, ctrl }) {
  $ngRedux.dispatch({
    type: 'REMOVE_TODO_ITEM',
    payload: ctrl.mutableItem.id || ctrl.item.id,
  });
}
