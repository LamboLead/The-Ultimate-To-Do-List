import * as RenderingModule from '../Presentation/rendering functions.js';
import {Task} from './task.js';

export class List {
    constructor(id, name, createdAt = new Date(), order = 1, currentTaskIndex = 1, tasks = []) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.order = order;
        this.currentTaskIndex = currentTaskIndex;
        this.tasks = tasks;
    }
    updateName(newName) {
        this.name = newName;
    }

    // Task-related
    createTask(caption) {
        let newTask = new Task(`task${this.currentTaskIndex}`, caption, false, this.currentTaskIndex);
        this.tasks.push(newTask);
        this.currentTaskIndex++;
        newTask.render();
    }
    findTaskIndex(taskId) {
        return this.tasks.findIndex((task) => task.id === taskId);
    }
    updateTask(taskId, newCaption) {
        let taskIndex = this.findTaskIndex(taskId);
        this.tasks[taskIndex].caption = newCaption;
    }
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