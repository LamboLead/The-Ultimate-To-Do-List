/**
 * This is the task-rendering module for To-do list functionality.<br>
 * It exports functions related to the rendering of tasks themselves.<br><br>
 * @module To-do/task-rendering
 */

import * as EventHandlingModule from '../../dom-element-handler.js';
import * as InitializationModule from '../initialization-module.js';

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
  newTask.setAttribute("data-task-id", taskId);
  let taskDivSelector = `[data-task-id=${taskId}] `;
  newTask.addEventListener("drop", () => {
    InitializationModule.watchTaskOrder();
  });

  // Task grip
  let newGrip = document.createElement("i");
  newGrip.classList.add("fas", "fa-grip-lines", "grip-task")

  // Task checkbox
  let newCheck = document.createElement("input");
  newCheck.type = "checkbox";
  newCheck.addEventListener("click", () => {
    InitializationModule.checkTask(taskId);
    // EventsModule.checkTask(taskId);
  });

  // Task input
  let newInput = document.createElement("input")
  newInput.type = "text";
  newInput.classList.add("task-content-input");
  newInput.value = taskCaption;
  let inputSelector = taskDivSelector + ".task-content-input";

  // Task delete button
  let newDelete = document.createElement("button")
  newDelete.type = "button";
  newDelete.classList.add("task-button", "delete-task-button");
  newDelete.title = "Delete task";
  newDelete.innerHTML = "<i class='far fa-trash-alt'></i>" + "<span class='text-button-span'>Delete</span>";
  newDelete.addEventListener("click", () => {
    // let taskId = event.target.parentElement.getAttribute("data-task-id");
    InitializationModule.deleteTask(taskId);
  });

  newTask.append(newGrip, newCheck, newInput, newDelete);
  taskList.append(newTask);

  if (isTaskCompleted) {
    newTask.classList.add("is-task-completed");
    newCheck.checked = true;
  }
  EventHandlingModule.handleUserInput(inputSelector, InitializationModule.editTask, taskId);

  setTimeout(() => {
    newTask.classList.add("is-task-created");
  }, 50);
}

