import angular from 'angular';
import {combineReducers} from 'redux';
import reduxLogger from 'redux-logger';
import 'ng-redux';

/* counter.controller.js */
class CounterController {
  constructor($scope, $ngRedux) {
    'ngInject';
    let ctrl = this;

    ctrl.counter = {};
    const unsubscribe = $ngRedux.connect(assignCounter, counterActions)(ctrl.counter);
    $scope.$on('$destroy', unsubscribe);
  }
}

function assignCounter(state) {
  return {
    value: state.counter
  };
}
/* end counter.controller.js */

export default angular.module('ngReduxSpike', ['ngRedux'])
  .config(configure)
  .component('counter', counterComponent())
  .run(onRun)
;

function configure($ngReduxProvider) {
  'ngInject';

  const reducer = combineReducers({
    counter: counterReducer
  });

  $ngReduxProvider.createStoreWith(
    reducer,
    [
      reduxLogger()
    ]
  );
}

const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
const COUNTER_DECREMENT = 'COUNTER_DECREMENT';
const COUNTER_RESET = 'COUNTER_RESET';
const COUNTER_SAVE_PENDING = 'COUNTER_SAVE_PENDING';
const COUNTER_SAVE_SUCCESS = 'COUNTER_SAVE_SUCCESS';
const COUNTER_SAVE_ERROR = 'COUNTER_SAVE_ERROR';

// @TODO WIP
function onRun($ngRedux) {
  'ngInject';

  // (action) => {
  //   const actions = [COUNTER_INCREMENT, COUNTER_DECREMENT, COUNTER_RESET];
  //   if (actions.indexOf(action.type) > -1) {
  //     store.dispatch({
  //       type: COUNTER_SAVE_PENDING
  //     });
  //   }
  //
  //   next(action);
  // };
}

function counterReducer(counter=0, action={}) {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return counter + 1;
    case COUNTER_DECREMENT:
      return counter - 1;
    case COUNTER_RESET:
      return 0;
  }

  return counter;
}

const counterActions = {
  increment() {
    return {
      type: COUNTER_INCREMENT
    };
  },

  decrement() {
    return {
      type: COUNTER_DECREMENT
    };
  },

  reset() {
    return {
      type: COUNTER_RESET
    };
  }
};

function counterComponent() {
  return {
    controllerAs: 'ctrl',
    controller: CounterController,
    template:`<div class="counter callout">
      <div class="counter__value">
        <strong>Counter: </strong> <span ng-bind="ctrl.counter.value"></span>
      </div>
      <div class="button-group">
        <button ng-click="ctrl.counter.decrement()" class="button">COUNTER_DECREMENT</button>
        <button ng-click="ctrl.counter.increment()" class="button">COUNTER_INCREMENT</button>
        <button ng-click="ctrl.counter.reset()" class="button alert">COUNTER_RESET</button>
      </div>
    </div>`
  };
}
