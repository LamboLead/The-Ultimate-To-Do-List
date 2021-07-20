/**
 * This is the list module for To-do list functionality.<br>
 * It stores and exports a class definition for a List object as default.<br>
 * Imports from {@link module: To-do/task}
 * @module To-do/list
 */

import * as RenderingModule from '../presentation/rendering functions.js';
import Task from './task.js';

/**
 * Class to create a List object
 * @class
 */
class List {

    /**
     * @constructs
     * @param {string} id Id of the new list
     * @param {string} name Name of the new list
     * @param {Date} [createdAt] Date of creation of the new list
     * @param {number} [order] Position of the list in the DOM
     * @param {number} [currentTaskIndex] Index of the last-created task
     * @param {Array<Object>} [tasks] Tasks inside the list
     */
    constructor(id, name, createdAt = new Date(), order = 1, currentTaskIndex = 1, tasks = []) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.order = order;
        this.currentTaskIndex = currentTaskIndex;
        this.tasks = tasks;
    }

    /**
     * Updates the name of the list to the received one
     * @param {string} newName New name of the list
     * @returns {void}
     */
    updateName(newName) {
        this.name = newName;
        RenderingModule.renderListInNavbar(this.id, this.name);
    }

    // Task-related

    /**
     * Creates, renders and saves a new Task object
     * @param {string} caption Caption of the new task
     * @returns {void}
     */
    createTask(caption) {
        let newTask = new Task(`task${this.currentTaskIndex}`, caption, false, this.currentTaskIndex);
        this.tasks.push(newTask);
        this.currentTaskIndex++;
        newTask.render();
    }

    /**
     * Searches inside the task array and finds the one that matches the provided id
     * @param {string} taskId Id of the task
     * @returns {number} Index of the task in the array
     */
    findTaskIndex(taskId) {
        return this.tasks.findIndex(task => task.id === taskId);
    }

    /**
     * Updates the task caption with the provided
     * @param {string} taskId Id of the updated task
     * @param {string} newCaption New caption for the task
     * @returns {void}
     */
    updateTask(taskId, newCaption) {
        let taskIndex = this.findTaskIndex(taskId);
        this.tasks[taskIndex].caption = newCaption;
    }

    /**
     * 
     * @param {*} taskId 
     */
    completeTask(taskId) {
        let taskIndex = this.findTaskIndex(taskId);
        let taskStatus = this.tasks[taskIndex].completed;
        this.tasks[taskIndex].completed = !taskStatus;
        console.log(this.tasks[taskIndex]);
    }
    deleteTask(taskId) {
        let taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        this.tasks.splice(taskIndex, 1);
    }
    rearrangeTasks(taskOrder) {
        taskOrder.forEach(pair => {
            let index = this.findTaskIndex(pair[0]);
            this.tasks[index].order = pair[1];
        });
        console.log(this.tasks);
    }
    render() {

        // Renders list as HTML
        console.log("Rendering list...");

        // Set up environment
        RenderingModule.showStartPage(false);
        RenderingModule.removeExistingTasks();

        // Render list
        RenderingModule.renderListInNavbar(this.id, this.name);
        RenderingModule.setListName(this.name);

        // Render each task
        let orderedTasks = this.tasks.sort((t1, t2) => {
            if (t1.order < t2.order) {
                return -1;
            } else {
                return 1;
            }
        });
        orderedTasks.forEach(task => task.render());
    }
}

export default List;