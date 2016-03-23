import './todo-editor.local.style.scss';
import templateUrl from './todo-editor.ngtpl.html';
import TodoEditorController from './todo-editor.controller';

const component = {
  bindings: {
    item: '<',
    isContentEditable: '<',
    isNewItem: '<',
    placeholder: '<',
  },
  templateUrl: templateUrl,
  controller: TodoEditorController,
};

export default component;
