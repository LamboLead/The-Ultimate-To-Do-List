import * as EventHandlingModule from '../event-handling-module.js';
import toDo from './logic/to-do.js';
import ToDo from './logic/to-do.js';

// Initialize application

ToDo.initialize();

// Set handler for saving information

let onSave = false;
const listBox = document.getElementById("list_div");
const saveObserver = new MutationObserver(() => {
  if (!onSave) {
    onSave = true;
    setTimeout(() => {
      onSave = false;
      ToDo.saveData();
    }, 1000);
  }
});
saveObserver.observe(listBox, {
  attributes: true,
  childList: true,
  subtree: true
});

// Set rearrange tasks handler - Drag & drop

const taskBox = document.getElementById("task_view_div");
new Sortable.create(taskBox, {
  animation: 150,
  chosenClass: "selected",
  ghostClass: "ghosted",
  handle: ".grip-img"
});


// <- <- <- Handle user events -> -> ->


EventHandlingModule.handleUserInput("#insert_task", createTask, undefined, true);
EventHandlingModule.handleUserInput("#list_name", (newName) => {
  ToDo.updateListName(newName);
});

let clearInputButton = document.getElementById("clear_input_button");
clearInputButton.addEventListener("click", () => {
  EventHandlingModule.clearInput("#insert_task");
});

let createTaskButton = document.getElementById("enter_task_button");
createTaskButton.addEventListener("click", () => {
  let userInput = EventHandlingModule.getUserInput("#insert_task");
  createTask(userInput);
  EventHandlingModule.clearInput("#insert_task");
});

/**
 * Creates a new task inside the current list with the specified caption
 * @param {string} taskName Caption of the new task
 */
 function createTask(taskName) {
  console.log(taskName);
  if (!ToDo.currentList) {
    ToDo.createList();
  }
  ToDo.currentList.createTask(taskName);
}

/**
 * Removes the specified task from the DOM and calls ...
 * @function deleteTask
 * @param {string} taskId Id of the task to delete
 */
export function deleteTask(taskId) {
  let taskDiv = document.querySelector(`[data-task-id=${taskId}]`);
  taskDiv.classList.add("is-task-deleted");
  taskDiv.addEventListener("transitionend", () => {
    taskDiv.remove();
  });

  ToDo.currentList.deleteTask(taskId);
}

export function editTask(inputValue, taskId) {
  ToDo.currentList.editTask(taskId, inputValue);
}

/**
 * Reads the state of the specified task and toggles it.
 * @function checkTask
 * @param {string} taskId Id of the checked/unchecked task
 */
export function checkTask(taskId) {
  let taskDiv = document.querySelector(`[data-task-id=${taskId}]`);
  let checkElement = taskDiv.querySelector('[type="checkbox"]');
  if (checkElement.checked) {
    taskDiv.classList.add("is-task-completed");
  } else {
    taskDiv.classList.remove("is-task-completed");
  }
  ToDo.currentList.checkTask(taskId, checkElement.checked);
}

/**
 * Scans the order of the tasks and calls...
 * @function watchTaskOrder
 */
export function watchTaskOrder() {
  let tasks = document.querySelectorAll(".task-div");
  let taskOrder = [];
  tasks.forEach((task) => {
    let taskId = task.getAttribute("data-task-id");
    taskOrder.push(taskId);
  });
  ToDo.currentList.rearrangeTasks(taskOrder);
}

// List-related events

let createListButton = document.getElementById("create_list_button");
createListButton.addEventListener("click", () => {
  ToDo.createList();
});

export function switchToList(listId) {
  if (ToDo.currentList.id === listId) return;
  ToDo.switchToList(listId);
}


import * as ToDoRenderingModule from '../to-do-list/rendering/to-do-rendering-module.js';
/**
 * Deletes the specified list if the user states so in the confirmation box
 * @param {string} listId Id of the specified list
 */
export async function deleteList(listId, listName) {
  let returnValue = await ToDoRenderingModule.showConfirmationDialog(
    "Delete list",
    `Do you want to delete '${listName}'?`,
    [
      {buttonName: "Delete list", returnValue: true},
      {buttonName: "Cancel", returnValue: false}
    ]
  );
  if (!returnValue) return;
  ToDo.deleteList(listId);
}

let arrow = document.getElementById("arrow_div");
arrow.addEventListener("click", () => {
  console.log(ToDo.currentListIndex);
  console.log(ToDo.currentList);
});