/* index.js */

const form = document.querySelector('form');
const pendingTasks = document.querySelector('#pendingTasks');
const finishedTasks = document.querySelector('#finishedTasks');

form.addEventListener('submit', (event) => {
  let taskName = form.newTask.value,
      li = document.createElement('li'),
      input = document.createElement('input'),
      text = document.createTextNode(taskName);
  event.preventDefault();
  input.type = 'checkbox';
  li.append(input);
  li.append(text);
  pendingTasks.append(li);
  form.newTask.value = '';
  input.addEventListener('change', checkHandler);
});

function checkHandler(event) {
  let list = event.target.checked ? finishedTasks : pendingTasks,
      parentList = !event.target.checked ? finishedTasks : pendingTasks,
      text = event.target.nextSibling,
      li = document.createElement('li');
  parentList.removeChild(event.target.parentElement);
  li.append(event.target, text);
  list.append(li);
}

document.querySelectorAll('input[type=checkbox]').forEach((input) => {
  input.addEventListener('change', checkHandler);
});
