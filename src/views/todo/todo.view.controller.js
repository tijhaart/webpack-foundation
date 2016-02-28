class TodoViewCtrl {
  constructor() {
    'ngInject';
    let ctrl = this;

    console.log('Hello from TodoViewCtrl');

    ctrl.items = getItems();
  }
}

function getItems() {
  let items = [
    { id: 1, title: 'Finish webpack-foundation', completed: false, disabled: true },
    { id: 2, title: 'Add image loading support', completed: false, disabled: false },
    { id: 3, title: 'Add font loading support', completed: false, disabled: false },
    { id: 4, title: 'Add bower component loading support', completed: false, disabled: false },
  ];

  return items;
}

export default TodoViewCtrl;
