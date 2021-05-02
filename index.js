/* index.js */

const storage = window.localStorage;
const tasks = [];

function makeId(name) {
  return `uid-${name}-${Math.floor(Math.random() * 100000) + Date.now()}`;
}

function createTask(name) {
  let task = {
    name: name,
    id: makeId(name),
    order: tasks.length,
    completed: false
  }
  return task;
}

function registerTask(task) {
  tasks[task.order] = task;
}

function saveTask(task) {
  let key = task.id,
      val = JSON.stringify(task);
  storage.setItem(key, val);
}

function makeTaskElement(task) {
  let li = document.createElement('li'),
      checkbox = document.createElement('input'),
      label = document.createElement('label'),
      text = document.createTextNode(task.name);
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.id = task.id;
  label.setAttribute('for', task.id);
  label.append(text);
  li.append(checkbox, label);
  checkbox.addEventListener('change', checkHandler);
  return li;
}

function getTaskElement(task) {
  let input = document.querySelector(`#${task.id}`);
  if (input == null) {
    return makeTaskElement(task);
  }
  return input.parentElement;
}

function appendTaskElement(task) {
  const finishedUl = document.querySelector('#finishedTasks'),
        pendingUL = document.querySelector('#pendingTasks');
  let parentUl = task.completed ? finishedUl : pendingUL,
      taskElem = getTaskElement(task);
  parentUl.append(taskElem);
}

function checkHandler(event) {
  let input = event.target,
      id = input.id,
      task = tasks.find(t => t.id == id);
  task.completed = input.checked;
  saveTask(task);
  appendTaskElement(task);
}

function onTaskInput(event) {
  const input = document.querySelector('#newTask');
  let task = createTask(input.value);
  registerTask(task);
  saveTask(task);
  appendTaskElement(task);
  event.preventDefault();
  input.value = '';
}

function loadTasks() {
  for (i = 0; i < storage.length; ++i) {
    let key = storage.key(i),
        task = JSON.parse(storage.getItem(key));
    registerTask(task);
    appendTaskElement(task);
  }
}

document.querySelector('form').addEventListener('submit', onTaskInput);
loadTasks();

function clear() {
  /* for testing */
  window.localStorage.clear();
}
