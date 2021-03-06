import * as RenderingModule from '../rendering/list-rendering-module.js';
import Task from './task.js';

/**
 * Class to create a List object
 * Imports: {@link module:Rendering/state-rendering module|state-rendering (module)}
 * @class List
 */
class List {

	/**
	 * @constructs
	 * @param {string} id Id of the new list
	 * @param {string} name Name of the new list
	 * @param {Date} [createdAt] Date of creation of the new list
	 * @param {number} [currentTaskIndex] Index of the last-created task
	 * @param {Array<Object>} [tasks] Tasks inside the list
	 */
	constructor(id, name, createdAt = new Date(), currentTaskIndex = 1, tasks = []) {
		this.id = id;
		this.name = name;
		this.createdAt = createdAt;
		this.currentTaskIndex = currentTaskIndex;
		this.tasks = tasks;
	}

	/**
	 * Updates the name of the list to the received one
	 * @param {string} newName New name of the list
	 */
	updateName(newName) {
		this.name = newName;
		RenderingModule.renderListInNavbar(this.id, this.name);
	}

	// Task-related

	/**
	 * Creates, renders and saves a new Task object
	 * @param {string} caption Caption of the new task
	 */
	createTask(caption) {
		let newTask = new Task(`task${this.currentTaskIndex}`, caption, false, this.currentTaskIndex);
		newTask.render();
		this.tasks.push(newTask);
		this.currentTaskIndex++;
	}

	/**
	 * Changes the specified task to the specified status
	 * @param {string} taskId Id of the task being checked
	 * @param {boolean} isChecked Indicator for the completion of the task
	 */
	checkTask(taskId, isChecked) {
		let taskIndex = findElementIndex(this.tasks, {prop: "id", val: taskId});
		this.tasks[taskIndex].completed = isChecked;
	}

	/**
	 * Updates the caption of the specified task
	 * @param {string} taskId Id of the task to edit
	 * @param {string} newCaption New caption of the task
	 */
	editTask(taskId, newCaption) {
		let taskIndex = findElementIndex(this.tasks, {prop: "id", val: taskId});	
		this.tasks[taskIndex].caption = newCaption;
	}

	/**
	 * Removes the specified task from the tasks array
	 * @param {string} taskId Id of the task to delete
	 */
	deleteTask(taskId) {
		let taskIndex = findElementIndex(this.tasks, {prop: "id", val: taskId});
		this.tasks.splice(taskIndex, 1);
	}

	/**
	 * Rearranges tasks according to the specified order
	 * @param {Array<string>} tasksOrderArr Array of organized tasks
	 */
	rearrangeTasks(tasksOrderArr) {
		tasksOrderArr.forEach((taskId, index) => {
			let taskIndex = findElementIndex(this.tasks, {prop: "id", val: taskId});
			this.tasks[taskIndex].order = index;
		});
		console.log(this.tasks);
	}

	/**
	 * Renders the list in the navbar
	 */
	renderInNavbar() {
		RenderingModule.renderListInNavbar(this.id, this.name);
	}

	/**
	 * Renders the list and its tasks in the main div
	 */
	render() {
		// Render list
		RenderingModule.removeExistingTasks();
		RenderingModule.setMainListName(this.name);
		RenderingModule.setListAsActive(this.id);

		// Render each task
		let orderedList = sortItems(this.tasks, "order");
		orderedList.forEach((task) => task.render());
	}
}

function sortItems(itemsArr, orderBy) {
	return itemsArr.sort((item1, item2) => {
		if (item1[orderBy] < item2[orderBy]) return -1;
		return 1;
	})
}

function findElementIndex(objectsArr, {prop, val}) {
	return objectsArr.findIndex((element) => element[prop] === val);
}

export default List;