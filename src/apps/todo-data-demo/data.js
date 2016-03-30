const todoItems = [
  { title: 'Add new todo item', completed: true },
  { title: 'Prevent adding new todo when input field is empty', completed: true },
  { title: 'Disable "Add" button when input is invalid', completed: true },
  { title: 'Add new todo by pressing ENTER', completed: true },
  { title: 'Clear todo item input field by pressing ESC', completed: true },
  { title: 'Clear todo item input field by clicking the "clear" button', completed: true },
  { title: 'Add new todo items on top of the list (order by createdAt)', completed: true },
  { title: 'Remove todo item', completed: true },
  { title: 'Edit todo item title', completed: true },
  { title: 'Fix inline editing', completed: false },
  { title: 'Add support for large icon buttons with an icon button component', completed: false },
  { title: 'Create a complete todo app', completed: false },
  { title: 'Display a message when a todo was added', completed: false },
  { title: 'Add support for running (mocha) tests', completed: false },
  { title: 'Refactor todoApp', completed: false },
  { title: 'Split components into seperate component files', completed: false },
  { title: 'Use normalizr to manage entities like todo items', completed: false },
  { title: 'Fgure out how to use RxJS with angular for input events (e.g. key events)', completed: false },
  { title: 'Use a remote api that serves fake (generated) data using json-schema-faker', completed: false },
  { title: 'Persist changes to the todo items', completed: false },
  { title: 'Group list into uncompleted and completed', completed: false },
  { title: 'Research angularjs + redux + time travel', completed: false },
  { title: 'Try out lodash/fp, because fp :P', completed: false },
  { title: 'Use nock to mock http requests', completed: false },
  { title: 'Research http middleware for processing http requests', completed: false },
  { title: 'Research reselect', completed: false },
  { title: 'Research multi transclusion in Angular 1.5', completed: false },
].map((item, index) => {
  item.id = _.uniqueId();
  item.createdAt = new Date(Date.now() - (index * 1000)).toISOString();
  return item;
});

export function getItems() {
  return todoItems;
}
