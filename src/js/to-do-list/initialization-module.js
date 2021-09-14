/**
 * @file The Ultimate To-do list
 * @author Juan David López López <juandlopez01@hotmail.com>
 * @see {@link https://github.com/LamboLead|GitHub @LamboLead}
 * @copyright Juan David López López - 2021
 * @version 1.0
*/

import * as EventHandlingModule from '../dom-element-handler.js';
import * as StateRenderingModule from '../to-do-list/rendering/state-rendering-module.js';
import ToDo from './logic/to-do.js';

// Remove page loader

const pageLoader = document.getElementById("loading_screen_div");
// window.onload = () => {
//     setTimeout(() => {
//         pageLoader.style.setProperty("top", "-100vh");
//     }, 3500);
// }

// Set handler for saving information

let onSave = false;
const listContainer = document.getElementById("list_div");
const saveObserver = new MutationObserver(saveDataHandler);
saveObserver.observe(listContainer, {
  subtree: true,
  childList: true,
  attributeFilter: ["value", "checked"]
});

export function saveDataHandler(mutationsList) {
  console.log(mutationsList);
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

function createTask(taskName) {
  console.log(taskName);
  if (!ToDo.currentList) {
    ToDo.createList();
  }
  ToDo.currentList.createTask(taskName);
}

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

export function checkTask(taskId) {
  let taskDiv = document.querySelector(`[data-task-id=${taskId}]`);
  let checkElement = taskDiv.querySelector('[type="checkbox"]');
  if (checkElement.checked) {
    taskDiv.classList.add("is-task-completed");
  } else {
    taskDiv.classList.remove("is-task-completed");
  }
  checkElement.setAttribute("checked", checkElement.checked);
  ToDo.currentList.checkTask(taskId, checkElement.checked);
}

export function watchTaskOrder() {
  let taskOrder = watchElementsOrder(".task-div", "data-task-id");
  ToDo.currentList.rearrangeTasks(taskOrder);
}

// List-related events

let createListButton = document.getElementById("create_list_button");
createListButton.addEventListener("click", () => {
  createListButton.classList.add("is-button-disabled");
  ToDo.createList();
  setTimeout(() => {
    createListButton.classList.remove("is-button-disabled");
  }, 1100);
});

export function switchToList(listId) {
  if (ToDo.currentList.id === listId) return;
  ToDo.switchToList(listId);
}

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