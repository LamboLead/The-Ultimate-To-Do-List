/**
 * This is the list-rendering module for To-do list functionality.<br>
 * It exports functions related to the rendering of lists and all related elements.<br><br>
 * @module To-do/list-rendering
 */

import * as InitializationModule from '../initialization-module.js';

/**
 * Updates the name of the list in its corresponding element in the DOM
 * @function setMainListName
 * @param {string} newListName Name for the new list
 */
export function setMainListName(newListName) {
  let listInput = document.getElementById("list_name");
  listInput.value = newListName;
}

/**
 * Renders the name of the specified list in the navbar
 * @function setNavbarListName
 * @param {string} listId Id of the required list
 * @param {string} newListName Name of the list to render
 */
export function setNavbarListName(listId, newListName) {
  let listInput = document.querySelector(`[data-list-id=${listId}]`).querySelector(".each-list-input");
  listInput.innerHTML = newListName;
  listInput.title = `Switch to '${newListName}'`;
}

/**
 * Renders the specified list as active
 * @function setListAsActive
 * @param {string} listId Id of the required list
 */
export function setListAsActive(listId) {
  let allLists = document.querySelectorAll("[data-list-id]");
  Array.from(allLists).forEach((list) => list.classList.remove("is-list-selected"));
  let listDiv = document.querySelector(`[data-list-id=${listId}]`);
  listDiv.classList.add("is-list-selected");
}

/**
 * Renders the specified list into the navbar
 * @function renderListInNavbar
 * @param {string} listId Id of the specified list
 * @param {string} newListName Name of the specified list
 */
export function renderListInNavbar(listId, newListName) {
  // Check if list already exists
  let listsdiv = document.getElementById("listing_div");
  let list = document.querySelector(`[data-list-id=${listId}]`);
  if (list) {
    setNavbarListName(listId, newListName);
    return;
  }

  // Create new list in navbar
  let listsContainer = document.getElementById("listing_div");

  let newList = document.createElement("div");
  newList.classList.add("each-list-div");
  newList.setAttribute("data-list-id", listId);
  newList.addEventListener("drop", () => {
    InitializationModule.watchListOrder();
    InitializationModule.saveDataHandler();
  });

  let newGrip = document.createElement("i");
  newGrip.classList.add("fas", "fa-grip-lines", "grip-list")

  let newListInput = document.createElement("div");
  newListInput.classList.add("each-list-input");
  newListInput.innerHTML = newListName;
  newListInput.title = `Switch to '${newListName}'`;
  newListInput.addEventListener("click", () => {
    InitializationModule.switchToList(listId);
  });

  let listDelete = document.createElement("div");
  listDelete.innerHTML = "<i class='far fa-trash-alt'></i>";
  listDelete.classList.add("each-list-delete");
  listDelete.title = "Delete list";
  listDelete.addEventListener("click", () => {
    let list = document.querySelector(`[data-list-id=${listId}]`);
    let listName = list.querySelector(".each-list-input").innerHTML;
    InitializationModule.deleteList(listId, listName);
  });

  newList.append(newGrip, newListInput, listDelete);
  listsContainer.append(newList);
}

/**
 * Removes the existing tasks from the DOM
 * @function removeExistingTasks
 */
export function removeExistingTasks() {
  let taskList = document.getElementById("task_view_div");
  let tasks = taskList.querySelectorAll("div .task-div");
  tasks.forEach((task) => task.remove());
}