/**
 * This is the to-do module for To-do list functionality.<br>
 * It stores a class for a ToDo object that handles the to-do functionality of the application.<br>
 * It exports a global toDo object as default.<br><br>
 * Imports: {@link database} {@link module:Storage/information-management|information-management module}
 * @module To-do/to-do
 */

import database from '../../storage/database-object.js';
import * as DatabaseInfoModule from '../../storage/information-management-module.js';
import * as RenderingModule from '../rendering/to-do-rendering-module.js';
import * as StateRenderingModule from '../rendering/state-rendering-module.js';
import Task from './task.js';
import List from './list.js';

/**
 * Class that create a ToDo object.<br><br>
 * Imports: {@link database}, {@link module:Storage/information-management|information-management module}, {@link module:To-do/rendering|To-do rendering module}
 * @class
 */
class ToDo {

	/** @constructs */
	constructor() {
		if (!ToDo.instance) {
			this.currentList = null;
			this.currentListIndex = 1;
			ToDo.instance = this;
		}
		return ToDo.instance;
	}

	/**
	 * Initializes the application by retrieving all information from the database by calling {@link module:Storage/information-management#retrieveInfo|retrieveInfo} and renders it by calling ...
	 */
	async initialize() {
		console.log("Initializing application");

		let currentListId, currentListIndex;

		[currentListId, currentListIndex] = await DatabaseInfoModule.retrieveInfo(database, "To-do information");
		console.log(`Current list: ${currentListId}. Next list: ${currentListIndex}`);

		if (!currentListId) return;

		[this.currentList, this.currentListIndex] = [currentListId, currentListIndex];

		// Render lists in navbar

		let retrievedLists = sortItems(await DatabaseInfoModule.retrieveInfo(database, "Lists"), "order");
		retrievedLists.forEach((list) => {
			let newList = normalizeList(list, false);
			newList.renderInNavbar();
		});

		// Render list in list view
		this.switchToList(currentListId);

		StateRenderingModule.showStartPage(false);
	}

	/**
		* Saves the app information into the database by calling the saveInfo method from {@link module: information-management}
		*/
	saveData() {
		if (!this.currentList) {return}
		DatabaseInfoModule.saveInfo(database, "Lists", {value: this.currentList});
		DatabaseInfoModule.saveInfo(database, "To-do information", {key: "currentList", value: this.currentList.id});
		DatabaseInfoModule.saveInfo(database, "To-do information", {key: "currentListIndex", value: this.currentListIndex});
	}

	/**
	 * Creates a new list, saves it into the database and renders it.
	 */
	createList() {
		this.currentList = new List(
				`list${this.currentListIndex}`,
				`My to-do list #${this.currentListIndex}`
		);
		this.currentListIndex++;
		
		this.currentList.renderInNavbar();
		this.currentList.render();

		StateRenderingModule.showStartPage(false);
	}

	/**
	 * Removes the specified list from the DOM, renders another one, and deletes the specified list from the database
	 * @param {string} listId The id of the deleted list
	 */
	async deleteList(listId) {
		
		// Find another list to render
		let listsArr = await DatabaseInfoModule.retrieveInfo(database, "Lists");
		let nextList = listsArr.find((list) => list.id !== listId);

		if (!nextList) {
			StateRenderingModule.showStartPage(true);
			DatabaseInfoModule.deleteInfo(database, "To-do information", {key: "currentList"});
			DatabaseInfoModule.deleteInfo(database, "To-do information", {key: "currentListIndex"});
			this.currentList = null;
			this.currentListIndex = 1;
		} else {
			this.switchToList(nextList.id);
		}
		// Remove list from navbar
		RenderingModule.removeListFromNavbar(listId);

		// Delete list from database
		DatabaseInfoModule.deleteInfo(database, "Lists", {key: listId});
	}

	/**
	 * Updates the name of the list to the specified new one
	 * @function updateListName
	 * @param {string} newListName New name of the list
	 */
	updateListName(newListName) {
		this.currentList.name = newListName;
		this.currentList.renderInNavbar();
	}

	/**
	 * Searches for the specified list in the database and renders it in the DOM
	 * @param {string} listId The id of the selected list
	 */
	async switchToList(listId) {
		let retrievedList = (await DatabaseInfoModule.retrieveInfo(database, "Lists", {query: listId}))[0];
		
		this.currentList = normalizeList(retrievedList, true);
		this.currentList.render();
	}
}

/**
 * Orders an array of objects according to the specified parameter
 * @function sortItems
 * @param {Array<Object>} itemsArr The array of items to sort
 * @param {string} orderBy Parameter to sort the array by
 * @returns {Array<Object>} Array with its items sorted
 */
function sortItems(itemsArr, orderBy) {
	return itemsArr.sort((item1, item2) => {
		if (item1[orderBy] < item2[orderBy]) return -1;
		return 1;
	})
}

/**
 * Normalizes retrieved lists from database by creating new ones.
 * @function normalizeList
 * @param {{id: string, name: string, createdAt: Date, order: number, currentTaskIndex: number, tasks: Array}} previousList
 * @param {boolean} fullNormalization Indicator to normalize list completely (with tasks) or partially (without tasks)
 * @returns {Object}
 */
function normalizeList(previousList, fullNormalization) {
	let newList = new List(previousList.id, previousList.name, previousList.createdAt, previousList.order, previousList.currentTaskIndex);
	if (fullNormalization) {
		previousList.tasks.forEach((task) => {
			let newTask = new Task(task.id, task.caption, task.completed, task.order);
			newList.tasks.push(newTask);
		});
	}
	return newList;
}

const toDo = new ToDo();
export default toDo;