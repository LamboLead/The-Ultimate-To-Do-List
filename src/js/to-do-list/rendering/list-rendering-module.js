import * as InitializationModule from '../initialization-module.js';
import * as ToDoRenderingModule from './to-do-rendering-module.js';

/**
 * Updates the name of the list in its corresponding element in the DOM
 * @function setListName
 * @param {string} newListName Name for the new list
 */
export function setMainListName(newListName) {
  let listInput = document.getElementById("list_name");
  listInput.value = newListName;
}

export function setNavbarListName(listId, newListName) {
  let listInput = document.querySelector(`[data-list-id=${listId}]`).querySelector(".each-list-input");
  listInput.innerHTML = newListName;
  listInput.title = `Switch to '${newListName}'`;
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
  newList.title = `Switch to '${newListName}'`;
  newList.setAttribute("data-list-id", listId);

  let newListInput = document.createElement("div");
  newListInput.classList.add("each-list-input");
  newListInput.innerHTML = newListName;
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

  newList.append(newListInput, listDelete);
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

/**
 * Checks if a list already exists in the Navbar
 * @function listAlreadyExists
 * @param {string} listId Id of the list to check its existence
 * @returns {boolean}
 */
function listAlreadyExists(listId) {
  let lists = document.getElementById("listing_div");
  lists.querySelectorAll ("div .each-list-div").forEach((list) => {
    if (list.id === listId) return true;
  });
  return false;
}