/* index.js */

const form = document.querySelector('form');
const pendingTasks = document.querySelector('#pendingTasks');
const finishedTasks = document.querySelector('#finishedTasks');
const storage = window.localStorage;

function appendTask(list, taskName, completed) {
  let li = document.createElement('li'),
      input = document.createElement('input'),
      text = document.createTextNode(taskName);
  input.type = "checkbox";
  input.checked = completed;
  input.addEventListener('change', checkHandler);
  li.append(input, text);
  list.append(li);
}

function loadTasks() {
  for (i = 0; i < storage.length; ++i) {
    let taskName = storage.key(i),
        completed = JSON.parse(storage.getItem(taskName)),
        parentList = completed ? finishedTasks : pendingTasks;
    appendTask(parentList, taskName, completed);
  }
}

function saveTask(taskName, completed) {
  storage.setItem(taskName, completed);
}

form.addEventListener('submit', (event) => {
  let input = document.querySelector('#newTask'),
      taskName = input.value;
  event.preventDefault();
  saveTask(taskName, false);
  appendTask(pendingTasks, taskName, false);
  input.value = '';
});

function checkHandler(event) {
  let completed = event.target.checked,
      newList = completed ? finishedTasks : pendingTasks,
      parentList = !completed ? finishedTasks : pendingTasks,
      taskName = event.target.nextSibling.data;

  parentList.removeChild(event.target.parentElement);
  appendTask(newList, taskName, completed);
  saveTask(taskName, completed);
}

document.querySelectorAll('input[type=checkbox]').forEach((input) => {
  input.addEventListener('change', checkHandler);
});

loadTasks();
