import * as EventHandlingModule from '../event-handling-module.js';
import toDo from './logic/to-do.js';
import ToDo from './logic/to-do.js';
import * as StateRenderingModule from '../to-do-list/rendering/state-rendering-module.js';

// Remove page loader

const pageLoader = document.getElementById("loading_screen_div");
window.onload = () => {
    setTimeout(() => {
        pageLoader.style.setProperty("top", "-100vh");
    }, 3500);
}

// Initialize application

ToDo.initialize();

// Set handler for saving information

let onSave = false;
const listContainer = document.getElementById("list_div");
const saveObserver = new MutationObserver(saveDataHandler);
saveObserver.observe(listContainer, {
  attributes: true,
  childList: true,
  subtree: true
});

export function saveDataHandler() {
  if (!onSave) {
    onSave = true;
    setTimeout(() => {
      onSave = false;
      ToDo.saveData();
    }, 1000);
  }
}

// Set handler for rearrange tasks

const taskBox = document.getElementById("task_view_div");
new Sortable.create(taskBox, {
  animation: 150,
  chosenClass: "selected",
  ghostClass: "ghosted",
  handle: ".grip-task"
});

// Set handler for rearrange list and save their order

const listBox = document.getElementById("listing_div");
new Sortable.create(listBox, {
  animation: 300,
  chosenClass: "selected",
  // ghostClass: "ghosted",
  handle: ".grip-list"
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
  let taskOrder = watchElementsOrder(".task-div", "data-task-id");
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

/**
 * Deletes the specified list if the user states so in the confirmation box
 * @param {string} listId Id of the specified list
 */
export async function deleteList(listId, listName) {
  let returnValue = await StateRenderingModule.showConfirmationDialog(
    "Delete list",
    `Do you want to delete '${listName}'?`,
    [
      {buttonName: "Delete list", color: "var(--clear)", returnValue: true},
      {buttonName: "Cancel", color: "default", returnValue: false}
    ]
  );
  if (!returnValue) return;
  ToDo.deleteList(listId);
}

export function watchListOrder() {
  let listOrder = watchElementsOrder(".each-list-div", "data-list-id");
  ToDo.rearrangeLists(listOrder);
}

/**
 * Scans the order of the elements with the specified selector in the DOM and returns it in an array
 * @function watchOrder
 * @param {string} elementsQuerySelector CSS selector of the elements you want to track their order
 * @param {string} attributeName Name of the attribute that identifies each element
 * @returns {Array<string>}
 */
function watchElementsOrder(elementsQuerySelector, attributeName) {
  let elements = document.querySelectorAll(elementsQuerySelector);
  let elementsOrder = [];
  elements.forEach((elem) => {
    let elementAttr = elem.getAttribute(attributeName);
    elementsOrder.push(elementAttr);
  });
  return elementsOrder;
}

let arrow = document.getElementById("arrow_div");
arrow.addEventListener("click", () => {
  console.log(ToDo.currentListIndex);
  console.log(ToDo.currentList);
  console.log(ToDo.lists);
});