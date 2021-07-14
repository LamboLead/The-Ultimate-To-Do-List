import * as EventsModule from './event functions.js';

// Task-related
export function renderTask(taskId, taskCaption, isTaskCompleted) {
    let taskList = document.getElementById("task_view_div");

    // Task div
    let newTask = document.createElement("div");
    newTask.classList.add("task-div");
    newTask.id = taskId;

    // Task grip
    let newGrip = document.createElement("img");
    newGrip.src = "SVG/Grip.svg";
    newGrip.classList.add("grip-img");
    // newGrip.addEventListener("mouseup", () => {
    //     EventsModule.watchTaskOrder();
    // });

    // Task checkbox
    let newCheck = document.createElement("input");
    newCheck.type = "checkbox";
    newCheck.addEventListener("click", event => {
        EventsModule.checkTask(event.target);
    });

    // Task input
    let newInput = document.createElement("input")
    newInput.type = "text";
    newInput.classList.add("task-content-input");
    newInput.value = taskCaption;
    newInput.addEventListener("keyup", event => {
        switch (event.code) {
            case "Enter":
                EventsModule.editTask(event.target.parentElement, event.target.value);
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
        EventsModule.deleteTask(event.target.parentElement);
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
export function renderListInNavbar(listId, listName) {
    let lists = document.getElementById("listing_div");

    // Check if there is already a list with the same id
    let listAlreadyExists = false;
    lists.querySelectorAll("div .each-list-div").forEach(list => {
        if (list.id === listId) {
            listAlreadyExists = true;
        }
    });
    if (listAlreadyExists) {return}

    // Create new list

    let newList = document.createElement("div");
    newList.classList.add("each-list-div");
    newList.title = `Switch to '${listName}'`;
    newList.id = listId;

    let newListInput = document.createElement("div");
    newListInput.classList.add("each-list-input");
    newListInput.innerHTML = listName;
    newListInput.addEventListener("click", event => {
        EventsModule.switchToList(event.target.parentElement.id);
    });

    let listDelete = document.createElement("div");
    listDelete.innerHTML = "<i class='far fa-trash-alt'></i>";
    listDelete.classList.add("each-list-delete");
    listDelete.title = "Delete list";
    listDelete.addEventListener("click", event => {
        EventsModule.deleteList(event.target.parentElement);
    });

    newList.append(newListInput, listDelete);
    lists.append(newList);
}
export function setListName(listName) {

    // Set list name inside #list_name
    let listInput = document.getElementById("list_name");
    listInput.value = listName;
}
export function removeExistingTasks() {

    // Deletes all existing tasks
    let taskList = document.getElementById("task_view_div");
    let tasks = taskList.querySelectorAll("div .task-div");
    tasks.forEach(task => task.remove());
}
export function renderListName(listId, listName) {

    // Updates the name of the list inside the navbar
    let listDiv = document.getElementById(listId);
    listDiv.querySelector("div .each-list-input").innerHTML = listName;
}

// Other
export function showStartPage(bool) {
    let mainContent = document.getElementById("main_content_div");
    if (bool) {
        mainContent.classList.add("on-start-page");
    } else {
        mainContent.classList.remove("on-start-page");
    }
}
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