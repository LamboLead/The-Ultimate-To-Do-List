/**
 * This is the event-functions module for To-do list functionality.<br>
 * It stores functions that are called whenever the user interacts with the to-do list UI.<br>
 * Imports from {@link module: to-do}.
 * @module To-do/event-functions
 */

import toDo from './logic/to-do.js';
import * as RenderingModule from './rendering/rendering functions.js';

// Database-related

/**
 * Initializes the application by calling the openDatabase method from toDo
 * @function initialize
 * @returns {void}
 */
export function initialize() {
    toDo.initialize();
}

/**
 * Saves all information by calling the saveData method from toDo
 * @function saveData
 * @returns {void}
 */
export function saveData() {
    console.log("Save data must be fired now!");
    setTimeout(toDo.saveData, 1000)
}

export function deleteDB() {
    toDo.deleteDatabase();
}

// Task insert-related

/**
 * Renders a new task in the DOM by calling createTask method from currentList inside toDo
 * @function newTask
 * @param {string} taskName The caption of the new task being created
 * @returns {void}
 */
export function newTask(taskName) {
    console.log("Creating task...");
    if (!toDo.currentList) {
        toDo.createList();
        StateRenderingModule.showStartPage(false);
    }
    toDo.currentList.createTask(taskName);
}

/**
 * Clears the text inside the specified input element
 * @function clearInput
 * @param {*} inputElementId The id of the input element
 * @returns {void}
 */
export function clearInput(inputElementId) {
    let inputElement = document.getElementById(inputElementId);
    inputElement.value = "";
}

// Task-related

/**
 * Updates the specified task in the database by calling the updateTask method from currentList inside toDo
 * @function editTask
 * @param {string} taskId The id of the div containing the edited task
 * @param {string} newCaption The new caption of the edited task
 * @returns {void}
 */
export function editTask(taskId, newCaption) {
    console.log("Editing task...");
    toDo.currentList.updateTask(taskId, newCaption);
}

/**
 * Removes the specified task from the DOM and updates the database...
 * @function deleteTask
 * @param {string} taskId The id of the deleted task
 * @returns {void}
 */
export function deleteTask(taskId) {
    let taskDiv = document.getElementById(taskId);
    toDo.currentList.deleteTask(taskId);

    // Removing task from DOM
    taskDiv.classList.add("is-task-deleted");
    taskDiv.addEventListener("transitionend", function() {
        taskDiv.remove();
    });

    setTimeout(() => {
        saveData(); // You may have to change this
    }, 1000);
}

/**
 * renders the specified task as checked and updates the database by calling completeTask method from currentList inside toDo
 * @function checkTask
 * @param {string} taskId The id of the task being checked/unchecked
 * @returns {void}
 */
export function checkTask(taskId) {
    let taskDiv = document.getElementById(taskId);
    let checkElement = taskDiv.querySelector('[type="checkbox"]');
    if (checkElement.checked) {
        taskDiv.classList.add("is-task-completed");
    } else {
        taskDiv.classList.remove("is-task-completed");
    }
    toDo.currentList.completeTask(taskId);
}

/**
 * Scans and updates the order of the tasks being moved by the user by calling the rearrangeTasks method from currentList inside toDo
 * @function watchTaskOrder
 * @returns {void}
 */
export function watchTasksOrder() {
    let taskView = document.getElementById("task_view_div");
    let taskArr = taskView.querySelectorAll(".task-div");
    let taskIds = [];
    taskArr.forEach((task, index) => {
        taskIds.push([task.id, index]);
    });
    if (taskIds.length !== 0) {
        toDo.currentList.rearrangeTasks(taskIds);
        console.log("Order has changed");
    }
}

// List-related

/**
 * Updates the name of the list in the database by calling the updateName method from currentList inside toDo and renders it in the DOM by calling the renderListName from RenderingModule
 * @function changeListName
 * @param {string} newListName The new name of the list
 * @return {void}
 */
export function changeListName(newListName) {
    toDo.currentList.updateName(newListName);
}

/**
 * Creates a new list by calling createList method in toDo
 * @function createList
 * @return {void}
 */
export function createList() {
    console.log("Creating new list...");
    toDo.createList();
}

/**
 * Removes the specified list from the DOM and calls the deleteList method from toDo
 * @function deleteList
 * @param {*} listId The id of the deleted list
 * @returns {void}
 */
export function deleteList(listId) {
    let listDiv = document.getElementById(listId);

    listDiv.classList.add("is-list-deleted");
    listDiv.addEventListener("transitionend", function() {
        listDiv.remove();
    });

    toDo.deleteList(listId);
}

/**
 * Renders the specified list in the DOM by calling the switchToList method from toDo
 * @param {string} listId The id of the selected list
 * @returns {void}
 */
export function switchToList(listId){
    if (listId === toDo.currentList.id) {return}
    console.log("Switching to list...");
    toDo.switchToList(listId);
}