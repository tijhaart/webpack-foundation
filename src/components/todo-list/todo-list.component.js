import TodoList from './todo-list.module';
import TodoListCtrl from './todo-list.controller';
import style from './todo-list.local.style.scss';

console.log(style, 's');

export default TodoList.component('todoList', {
  controller: TodoListCtrl,
  template: function() {
    return `<div class="${style.root}">
      <h2>TodoList</h2>

      <button type="button" class="button">Create</button>
    </div>`;
  }
});
