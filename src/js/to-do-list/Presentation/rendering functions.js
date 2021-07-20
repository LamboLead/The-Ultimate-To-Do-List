/**
 * This is the rendering module for To-do list functionality.<br>
 * It stores functions that render lists, tasks, and related elements.<br>
 * Imports from {@link module: To-do/event-functions}
 * @module To-do/rendering
 */

import * as EventsModule from '../event-functions.js';

// Task-related

/**
 * Renders the specified task into the DOM
 * @function renderTask
 * @param {string} taskId Id of the new task
 * @param {string} taskCaption Caption of the new task
 * @param {boolean} isTaskCompleted Indicator that specifies if the task is completed or not.
 */
export function renderTask(taskId, taskCaption, isTaskCompleted) {
    let taskList = document.getElementById("task_view_div");

    // Task div
    let newTask = document.createElement("div");
    newTask.classList.add("task-div");
    newTask.id = taskId;

    // Task grip
    let newGrip = document.createElement("img");
    newGrip.src = '../../../../src/assets/SVG/Grip.svg';
    newGrip.classList.add("grip-img");
    // newGrip.addEventListener("mouseup", () => {
    //     EventsModule.watchTaskOrder();
    // });

    // Task checkbox
    let newCheck = document.createElement("input");
    newCheck.type = "checkbox";
    newCheck.addEventListener("click", event => {
        let taskId = event.target.parentElement.id;
        EventsModule.checkTask(taskId);
    });

    // Task input
    let newInput = document.createElement("input")
    newInput.type = "text";
    newInput.classList.add("task-content-input");
    newInput.value = taskCaption;
    newInput.addEventListener("keyup", event => {
        switch (event.code) {
            case "Enter":
                let taskId = event.target.parentElement.id;
                let taskCaption = event.target.value;
                EventsModule.editTask(taskId, taskCaption);
                event.target.blur();
                break;
        }
    });

    // Task delete button
    let newDelete = document.createElement("button")
    newDelete.type = "button";
    newDelete.classList.add("task-button", "delete-task-button");
    newDelete.title = "Delete task";
    newDelete.innerHTML = "<i class='far fa-trash-alt'></i>" + "<span class='text-button-span'>Delete</span>";
    newDelete.addEventListener("click", event => {
        let taskId = event.target.parentElement.id;
        EventsModule.deleteTask(taskId);
    });

    newTask.append(newGrip, newCheck, newInput, newDelete);
    taskList.append(newTask);

    if (isTaskCompleted) {
        newTask.classList.add("is-task-completed");
        newCheck.checked = true;
    }

    setTimeout(() => {
        newTask.classList.add("is-task-created");
    }, 50);
}

// List-related

/**
 * Renders the specified list into the navbar
 * @function renderListInNavbar
 * @param {string} listId Id of the specified list
 * @param {string} listName Name of the specified list
 * @returns {void}
 */
export function renderListInNavbar(listId, newListName) {
    let lists = document.getElementById("listing_div");

    // Check if there is already a list with the same id
    let listAlreadyExists = false;
    lists.querySelectorAll("div .each-list-div").forEach(list => {
        if (list.id === listId) {
            // Update the name of the list
            let listInput = list.querySelector(".each-list-input");
            console.log(listInput);
            listInput.innerHTML = newListName;
            listInput.title = `Switch to '${newListName}'`;
            listAlreadyExists = true;
        }
    });
    if (listAlreadyExists) {return}

    // Create new list

    let newList = document.createElement("div");
    newList.classList.add("each-list-div");
    newList.title = `Switch to '${newListName}'`;
    newList.id = listId;

    let newListInput = document.createElement("div");
    newListInput.classList.add("each-list-input");
    newListInput.innerHTML = newListName;
    newListInput.addEventListener("click", event => {
        let listId = event.target.parentElement.id;
        EventsModule.switchToList(listId);
    });

    let listDelete = document.createElement("div");
    listDelete.innerHTML = "<i class='far fa-trash-alt'></i>";
    listDelete.classList.add("each-list-delete");
    listDelete.title = "Delete list";
    listDelete.addEventListener("click", event => {
        let listId = event.target.parentElement.id;
        EventsModule.deleteList(listId);
    });

    newList.append(newListInput, listDelete);
    lists.append(newList);
}

/**
 * Updates the name of the list in the DOM
 * @function setListName
 * @param {string} listName Updated name for the list
 */
export function setListName(listName) {

    // Set list name inside #list_name
    let listInput = document.getElementById("list_name");
    listInput.value = listName;
}

/**
 * Removes the existing tasks from the DOM
 * @function removeExistingTasks
 */
export function removeExistingTasks() {
    let taskList = document.getElementById("task_view_div");
    let tasks = taskList.querySelectorAll("div .task-div");
    tasks.forEach(task => task.remove());
}

/**
 * Updates the name of the list inside the navbar
 * @function updateListNameInNavbar
 * @param {string} listId Id of the specified list
 * @param {string} listName New name of the specified list
 */
export function updateListNameInNavbar(listId, listName) {
    let listDiv = document.getElementById(listId);
    listDiv.querySelector("div .each-list-input").innerHTML = listName;
}

// Other

/**
 * Renders the start page if needed
 * @function showStartPage
 * @param {boolean} indicator Indicator for the start page to be rendered
 */
export function showStartPage(indicator) {
    let mainContent = document.getElementById("main_content_div");
    if (indicator) {
        mainContent.classList.add("on-start-page");
    } else {
        mainContent.classList.remove("on-start-page");
    }
}

/**
 * Displays the pop-up alert with the specified message
 * @function popAppear
 * @param {string} message Message to show inside the pop-up alert
 */
function popAppear(message) {
    let alertPop = document.getElementById("pop_up_div");
    alertPop.innerText = `✅ ${message}`;
    setTimeout(() => {
        alertPop.classList.add("is-appearing");
    }, 100);
    setTimeout(() => {
        alertPop.classList.remove("is-appearing");
        alertPop.classList.add("is-dissapearing");
    }, 3000);
    alertPop.addEventListener("transitionend", function() {
        alertPop.classList.remove("is-dissapearing");
    });
}