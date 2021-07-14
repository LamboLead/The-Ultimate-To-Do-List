import toDo from '../Logic/to do.js';
import * as RenderingModule from './rendering functions.js';

// Informative

export function inform() {
    toDo.displayInformation();
}

// Database related

export function initialize() {
    toDo.openDatabase();
}

export function saveData() {
    console.log("Save data must be fired now!");
    toDo.saveInfo();
}

export function deleteDB() {
    toDo.deleteDatabase();
}

// Task insert-related

export function newTask(taskName) {
    console.log("Creating task...");
    if (!toDo.currentList) {
        toDo.createList();
        RenderingModule.showStartPage(false);
    }
    toDo.currentList.createTask(taskName);
}

export function clearInput(inputElement) {
    inputElement.value = "";
}

// Task-related

export function editTask(taskDiv, newCaption) {
    console.log("Editing task...");
    let taskId = taskDiv.id;
    toDo.currentList.updateTask(taskId, newCaption);
}

export function deleteTask(taskDiv) {
    let taskId = taskDiv.id;
    toDo.currentList.deleteTask(taskId);

    // Removing task from DOM
    taskDiv.classList.add("is-task-deleted");
    taskDiv.addEventListener("transitionend", function() {
        taskDiv.remove();
    });

    setTimeout(() => {
        saveData();
    }, 1000);
}

export function checkTask(checkElement) {
    let taskId = checkElement.parentElement.id;
    if (checkElement.checked) {
        checkElement.parentElement.classList.add("is-task-completed");
    } else {
        checkElement.parentElement.classList.remove("is-task-completed");
    }
    toDo.currentList.completeTask(taskId);
}

export function watchTasksOrder() {
    let taskArr = document.querySelectorAll(".task-div");
    let taskIds = [];
    taskArr.forEach((task, index) => {
        taskIds.push([task.id, index]);
    });
    if (taskIds.length !== 0) {
        toDo.currentList.rearrangeTasks(taskIds);
        console.log("Order changed");
    }
}

// List-related

export function changeListName(listName) {
    toDo.currentList.updateName(listName);
    RenderingModule.renderListName(toDo.currentList.id, listName);
}
export function createList() {
    console.log("Creating new list...");
    toDo.createList();
}
export function deleteList(listDiv) {

    // Remove list from DOM
    listDiv.classList.add("is-list-deleted");
    listDiv.addEventListener("transitionend", function() {
        listDiv.remove();
    });

    toDo.deleteList(listDiv.id);
}
export function switchToList(listId){
    if (listId === toDo.currentList.id) {return}
    console.log("Switching to list...");
    toDo.switchToList(listId);
}