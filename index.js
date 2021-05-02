/* index.js */

const storage = window.localStorage;
let tasks = [];

function makeId(name) {
  return `uid-${name}-${Math.floor(Math.random() * 100000) + Date.now()}`;
}

function getTaskIndex() {
  let n = tasks.length;
  if (n) {
    return tasks[tasks.length - 1].index + 1;
  } else {
    return 0;
  }
}

function createTask(name) {
  let task = {
    name: name,
    id: makeId(name),
    index: getTaskIndex(),
    completed: false
  }
  return task;
}

function registerTask(task) {
  tasks[task.index] = task;
}
function unregisterTask(task) {
  /* using .filter instead of .splice
     because undefined values left by .splice
     cause future calls to .find to fail,
     so they would need to be filtered out anyway.
  */
  let newTasks = tasks.filter(t => t !== task);
  tasks = newTasks;
}

function saveTask(task) {
  let key = task.id,
      val = JSON.stringify(task);
  storage.setItem(key, val);
}
function removeTask(task) {
  let key = task.id;
  storage.removeItem(key);
}

function makeTaskElement(task) {
  const removeBtnText = document.createTextNode('-');
  let li = document.createElement('li'),
      checkbox = document.createElement('input'),
      label = document.createElement('label'),
      text = document.createTextNode(task.name),
      removeBtn = document.createElement('button');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.id = task.id;
  label.setAttribute('for', task.id);
  label.append(text);
  removeBtn.setAttribute('data-id', task.id);
  removeBtn.append(removeBtnText);
  li.append(checkbox, label, removeBtn);
  checkbox.addEventListener('change', checkHandler);
  removeBtn.addEventListener('click', removeButtonHandler);
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

function removeTaskElement(task) {
  let taskElem = getTaskElement(task);
  taskElem.remove();
}

function removeButtonHandler(event) {
  event.preventDefault();
  let id = event.target.dataset.id,
      task = tasks.find(t => t.id == id);
  removeTaskElement(task);
  removeTask(task);
  unregisterTask(task);
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
