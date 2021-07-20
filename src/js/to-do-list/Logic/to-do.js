/**
 * This is the to-do module for To-do list functionality.<br>
 * It stores a class for a ToDo object that handles the to-do functionality of the application.<br>
 * It exports a global toDo object as default.<br><br>
 * Imports: {@link database} {@link module:Storage/information-management|information-management module}
 * @module To-do/to-do
 */

import database from '../../storage/database-object.js';
import * as DatabaseInfoModule from '../../storage/information-management-module.js';
import * as RenderingModule from '../presentation/rendering functions.js';
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

    displayInformation() {
        console.log(this.currentList.id, this.currentListIndex);
    }

    // Database & information retrievement-related

    /**
     * Initializes the application by retrieving all information from the database by calling {@link module:Storage/information-management#retrieveInfo|retrieveInfo} and renders it by calling {@link module:To-do/rendering#renderListInNavbar|renderListInNavbar}
     * @returns {Promise<void>}
     */
    async initialize() {

        console.log("Retrieving information...");

        // Retrieving current list and index

        let appInfo = await DatabaseInfoModule.retrieveInfo(database, "App information");
        console.log("Info retrieved:", appInfo);
        
        if (appInfo.length === 0) {return}

        this.currentListIndex = appInfo[1];

        // Retrieving all lists

        let retrievedLists = await DatabaseInfoModule.retrieveInfo(database, "Lists");
        let orderedLists = retrievedLists.sort((l1, l2) => {
            if (l1.order < l2.order) {
                return -1;
            } else {
                return 1;
            }
        });
        orderedLists.forEach(list => {
            RenderingModule.renderListInNavbar(list.id, list.name);
        });

        // -> Retrieving current list
        this.switchToList(appInfo[0]);
    }

    /**
     * Saves the actual information into the database by calling the saveInfo method from {@link module: information-management}
     * @returns {void}
     */
    saveData() {
        if (!this.currentList) {return}
        DatabaseInfoModule.saveInfo(database, "Lists", {value: this.currentList});
        DatabaseInfoModule.saveInfo(database, "App information", {key: "currentList", value: this.currentList.id});
        DatabaseInfoModule.saveInfo(database, "App information", {key: "currentListIndex", value: this.currentListIndex});
    }

    // List methods

    /**
     * Creates a new list, saves it into the database and renders it.
     */
    createList() {
        let newList = new List(
            `list${this.currentListIndex}`,
            `My to-do list #${this.currentListIndex}`,
            [,,],
            this.currentListIndex
        );
        this.currentList = newList;
        this.currentListIndex++;

        DatabaseInfoModule.saveInfo(database, "App information", {key: "currentList", value: this.currentList.id});
        DatabaseInfoModule.saveInfo(database, "App information", {key: "currentListIndex", value: this.currentListIndex});

        newList.render();
    }

    /**
     * Removes the specified list from the DOM, renders another one, and deletes the specified list from the database
     * @param {string} listId The id of the deleted list
     * @returns {Promise<void>}
     */
    async deleteList(listId) {

        let listsArr = await DatabaseInfoModule.retrieveInfo(database, "Lists");
        let nextList = listsArr.find(list => list.id !== listId);
        
        if (!nextList) {
            RenderingModule.showStartPage(true);
            DatabaseInfoModule.deleteInfo(database, "App information", {key: "currentList"});
            DatabaseInfoModule.deleteInfo(database, "App information", {key: "currentListIndex"});
            this.currentList = null;
            this.currentListIndex = 1;
        } else {
            this.switchToList(nextList.id);
        }

        // Delete list from database
        DatabaseInfoModule.deleteInfo(database, "Lists", {key: listId});
    }

    /**
     * Searches for the specified list in the database and renders it in the DOM
     * @param {string} listId The id of the selected list
     * @returns {Promise<void>}
     */
    async switchToList(listId) {
        let retrievedList = await DatabaseInfoModule.retrieveInfo(database, "Lists", {query: listId});
        retrievedList = retrievedList[0];

        let newList = new List(retrievedList.id, retrievedList.name, retrievedList.createdAt, retrievedList.order, retrievedList.currentTaskIndex);
        retrievedList.tasks.forEach(task => {
            let newTask = new Task(task.id, task.caption, task.completed, task.order);
            newList.tasks.push(newTask);
        });

        this.currentList = newList;
        this.currentList.render();

        DatabaseInfoModule.saveInfo(database, "App information", {key: "currentList", value: this.currentList.id});
    
    }
}

const toDo = new ToDo();
export default toDo;