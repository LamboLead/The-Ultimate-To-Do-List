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
			this.lists = [];
			ToDo.instance = this;
		}
		this.initialize();
		return ToDo.instance;
	}

	/**
	 * Initializes the application by retrieving all information from the database by calling {@link module:Storage/information-management#retrieveInfo|retrieveInfo} and renders it by calling ...
	 */
	async initialize() {
		console.log("Initializing application");

		let currentListId, currentListIndex, lists;

		[currentListId, currentListIndex, lists] = await DatabaseInfoModule.retrieveInfo(database, "To-do information");
		console.log(`Current list: ${currentListId}. Next list: ${currentListIndex}. Lists: ${lists}`);

		if (!currentListId) return;

		[this.currentList, this.currentListIndex, this.lists] = [currentListId, currentListIndex, lists];

		// Render lists in navbar

		let retrievedLists = await DatabaseInfoModule.retrieveInfo(database, "Lists"); // Sort lists by order
		let orderedLists = this.lists.map((listId) => {
			let listIndex = findElementIndex(retrievedLists, {prop: "id", val: listId});
			return retrievedLists[listIndex];
		});

		orderedLists.forEach((list) => {
			let newList = normalizeList(list, false);
			newList.renderInNavbar();
		});

		// Render current list in list view
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
		DatabaseInfoModule.saveInfo(database, "To-do information", {key: "lists", value: this.lists});
	}

	/**
	 * Creates a new list, saves it into the database and renders it.
	 */
	createList() {
		let newListId = `list${this.currentListIndex}`;
		this.currentList = new List(
			newListId,
			`My to-do list #${this.currentListIndex}`,
			undefined,
			this.currentListIndex
		);
		this.lists.push(newListId);
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

		// Delete list from array
		let listIndex = this.lists.findIndex((id) => id === listId);
		this.lists.splice(listIndex, 1);
		
		// Find the next list to render
		
		let nextListId = this.lists[0];

		if (!nextListId) {
			StateRenderingModule.showStartPage(true);
			DatabaseInfoModule.deleteInfo(database, "To-do information", {key: "currentList"});
			DatabaseInfoModule.deleteInfo(database, "To-do information", {key: "currentListIndex"});
			DatabaseInfoModule.deleteInfo(database, "To-do information", {key: "lists"});
			this.currentList = null;
			this.currentListIndex = 1;
		} else {
			this.switchToList(nextListId);
		}
		// Remove list from navbar
		RenderingModule.removeListFromNavbar(listId);

		// Delete list from database and ToDo
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

	/**
	 * Rearranges lists according to the specified order
	 * @param {Array<string>} listsOrderArr Array of organized lists
	 */
	rearrangeLists(listsOrderArr) {
		this.lists = listsOrderArr
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
	let newList = new List(previousList.id, previousList.name, previousList.createdAt, previousList.currentTaskIndex);
	if (fullNormalization) {
		previousList.tasks.forEach((task) => {
			let newTask = new Task(task.id, task.caption, task.completed, task.order);
			newList.tasks.push(newTask);
		});
	}
	return newList;
}

/**
 * Searches inside an array of objects and finds the one that matches the provided property-value pair
 * @function findElementIndex
 * @param {Array<Object>} objectsArr Array of objects to perform the searching
 * @param {{prop: string, val:string|number}} parameters Parameters of the object to match
 * @returns {number} Index of the element in the array
 */
function findElementIndex(objectsArr, {prop, val}) {
	return objectsArr.findIndex((element) => element[prop] === val);
}

const toDo = new ToDo();
export default toDo;