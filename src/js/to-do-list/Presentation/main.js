import * as EventsModule from './event functions.js';

// Initializing application

EventsModule.initialize();

let listBox = document.getElementById("list_div");
document.addEventListener("change", () => {
    EventsModule.watchTasksOrder();
    setTimeout(() => {
        EventsModule.saveData();
    }, 1000);
});

const pageLoader = document.getElementById("loading_screen_div");
window.onload = () => {
    setTimeout(() => {
        pageLoader.style.setProperty("top", "-100vh");
    }, 3500);
}

// Task insert

let inputTask = document.getElementById("insert_task");
let clearText = document.getElementById("clear_input_button");
let createTask = document.getElementById("enter_task_button");

inputTask.addEventListener("keyup", (key) => {
    switch (key.code) {
        case "Enter":
            EventsModule.newTask(inputTask.value);
            inputTask.value = "";
            break;
        case "Escape":
            EventsModule.clearInput(inputTask);
            break;
    }
});
clearText.addEventListener("click", () => {
    EventsModule.inform();
    // EventsModule.clearInput(inputTask)
});
// createTask.addEventListener("click", EventsModule.newTask(inputTask.value));

// Change list name

let listName = document.getElementById("list_name");
let currentListName = "";

listName.addEventListener("focus", () => {
    currentListName = listName.value;
});

listName.addEventListener("keyup", (key) => {
    switch (key.code) {
        case "Enter":
            EventsModule.changeListName(listName.value);
            listName.blur();
            break;
        case "Escape":
            listName.value = currentListName;
            listName.blur();
            break;
        }
});

// Create list

let createList = document.getElementById("create_list_button");
createList.addEventListener("click", () => EventsModule.createList());

// Drag & drop

const list = document.getElementById("task_view_div");
new Sortable.create(list, {
    animation: 150,
    chosenClass: "selected",
    ghostClass: "ghosted",
    handle: ".grip-img"
});