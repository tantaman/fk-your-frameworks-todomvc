const todoApp = (state) => {
  const remaining = state.items.filter(item => !item.complete);
  let toggleAll = '';
  if (state.items.length) {
    toggleAll =
      `<input
        type="checkbox"
        class="toggle-all"
        ${remaining.length ? '' : 'checked'}
        onclick="toggleAll();"
      />`;
  }
  return (
    `<div class="todoapp">
      ${header()}
      <section class="main">
        ${toggleAll}
        <ul class="todo-list">${state.items.map(todo).join('')}</ul>
      </section>
      ${state.items.length ? footer(remaining, state.items) : ''}
    </div>`
  );
}
const header = () =>
  `<header class="header">
    <h1>todos</h1>
    <input
      type="text"
      class="new-todo"
      id="todoInput"
      placeholder="What needs to be done?"
      onkeydown="onCreate(event)"
      value="${state.newTodo}"
    />
  </header>`;
const todo = (item, i) => {
  if (state.filter === 'completed' && !item.complete) return '';
  if (state.filter === 'active' && item.complete) return '';
  let body = '';
  if (item._editing) {
    body = `
      <input
        type="text"
        class="edit"
        autofocus="true"
        value="${item.name}"
        onkeydown="onSave(event, ${i})"
        onblur="onSave(event, ${i})"
      />
    `;
  } else {
    body = `
      <div class="view">
        <input
          type="checkbox"
          class="toggle"
          ${item.complete ? 'checked' : ''}
          onclick="toggle(${i});"
        />
        <label ondblclick="startEditing(${i})">${item.name}</label>
        <button class="destroy" onClick="remove(${i})" />
      </div>
    `;
  }

  return `
    <li class="${item.complete ? 'completed' : ''} ${item._editing ? 'editing' : ''}">
      ${body}
    </li>
  `;
};
const footer = (remaining, items) => {
  let clearCompleted = '';
  if (remaining.length !== items.length) {
    clearCompleted = `<button class="clear-completed" onClick="clearCompleted()">Clear completed</button>`;
  }
  return (
    `<footer class="footer">
      <span class="todo-count">
        <strong>
          ${remaining.length ? remaining.length : 'No'}
        </strong> items left
      </span>
      <ul class="filters">
        <li>
          <a class="${state.filter === '' ? 'selected' : ''}" onClick="updateFilter('')">All</a>
        </li>
        <li>
          <a class="${state.filter === 'active' ? 'selected' : ''}" onClick="updateFilter('active')">Active</a>
        </li>
        <li>
          <a class="${state.filter === 'completed' ? 'selected' : ''}" onClick="updateFilter('completed')">Completed</a>
        </li>
      </ul>
      ${clearCompleted}
    </footer>`
  );
}

function toggleAll() {
  const hasRemaining = state.items.filter(i => !i.complete).length != 0;
  state.items.forEach(i => i.complete = hasRemaining);
  turnTheCrank();
}
function clearCompleted() { state.items = state.items.filter(i => !i.complete); turnTheCrank(); }
function onCreate(e) {
  const text = getFinalText(e);
  if (text) {
    state.items.push({
      name: text,
      complete: false,
    });
    state.newTodo = '';
    turnTheCrank('todoInput');
  }
}
function onSave(e, i) {
  const text = getFinalText(e);
  if (text) {
    state.items[i].name = text;
    state.items[i]._editing = false;
    turnTheCrank();
  }
}
function toggle(i) { state.items[i].complete = !state.items[i].complete; turnTheCrank(); }
function remove(i) { state.items.splice(i, 1); turnTheCrank(); }
function startEditing(i) { state.items[i]._editing = true; turnTheCrank(); }
function updateFilter(filter) { window.location.hash = filter; }
window.onhashchange = function() {
  state.filter = window.location.hash.split('#')[1] || '';
  turnTheCrank();
}
const getFinalText = (e) => e.which === 13 || e.type === 'blur' ? escapeSpecialChars(e.target.value.trim()) : null;
const tempEl = document.createElement('div');
function escapeSpecialChars(value) {
  tempEl.textContent = value;
  return tempEl.innerHTML;
}
const container = document.getElementById('container');
const prevState = localStorage.getItem('todo-decl');
const state = {
  filter: window.location.hash.split('#')[1] || '',
  newTodo: '',
  items: (prevState && JSON.parse(prevState)) || [{
    name: 'Unbloat',
    complete: true,
  }],
};
function turnTheCrank(refocus) {
  requestAnimationFrame(() => {
    container.innerHTML = todoApp(state);
    if (refocus) document.getElementById(refocus).focus();
  });
}
window.onbeforeunload = () => localStorage.setItem('todo-decl', JSON.stringify(state.items));
turnTheCrank();
