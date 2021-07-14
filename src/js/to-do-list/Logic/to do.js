import * as DatabaseModule from '../../Storage/Indexed DB/database management.js';
import * as DatabaseInfoModule from '../../Storage/Indexed DB/information management functions.js';
import * as RenderingModule from '../Presentation/rendering functions.js';
import {Task} from './task.js';
import {List} from './list.js';

class ToDo {
    constructor() {
        if (!ToDo.instance) {
            this.database = null;
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
    async openDatabase() {
        this.database = await DatabaseModule.openDatabase("The Ultimate To-do list");
        this.retrieveInfo();
    }
    deleteDatabase() {
        DatabaseModule.deleteDatabase("The Ultimate To-do list");
        this.database = null;
    }
    async retrieveInfo() {

        // Retrieves and renders all information from database
        console.log("Retrieving information...");

        // -> Retrieving current list and index

        let appInfo = await DatabaseInfoModule.retrieveInfo(this.database, "App information");
        console.log("Info retrieved:", appInfo);
        
        if (appInfo.length === 0) {return}

        this.currentListIndex = appInfo[1];

        // -> Retrieving all lists

        let retrievedLists = await DatabaseInfoModule.retrieveInfo(this.database, "Lists");
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
    async saveInfo() {
        DatabaseInfoModule.saveInfo(this.database, "Lists", {value: this.currentList});
    }

    // List methods
    createList() {
        let newList = new List(
            `list${this.currentListIndex}`,
            `My to-do list #${this.currentListIndex}`,
            [,,],
            this.currentListIndex
        );
        this.currentList = newList;
        this.currentListIndex++;

        DatabaseInfoModule.saveInfo(this.database, "App information", {key: "currentList", value: this.currentList.id});
        DatabaseInfoModule.saveInfo(this.database, "App information", {key: "currentListIndex", value: this.currentListIndex});

        newList.render();
        this.saveInfo();
    }
    async deleteList(listId) {
        // Looks for another list in the database. If it finds it, it switches to it. If it doesn't, it returns to the start page. Then, it deletes the list from the database

        let listsArr = await DatabaseInfoModule.retrieveInfo(this.database, "Lists");
        let nextList = listsArr.find((list) => list.id !== listId);
        
        if (!nextList) {
            RenderingModule.showStartPage(true);
            DatabaseInfoModule.deleteInfo(this.database, "App information", {key: "currentList"});
            DatabaseInfoModule.deleteInfo(this.database, "App information", {key: "currentListIndex"});
            this.currentList = null;
            this.currentListIndex = 1;
        } else {
            this.switchToList(nextList.id);
        }

        // Delete list from database
        DatabaseInfoModule.deleteInfo(this.database, "Lists", {key: listId});
    }
    async switchToList(listId) {
        let retrievedList = await DatabaseInfoModule.retrieveInfo(this.database, "Lists", {query: listId});
        retrievedList = retrievedList[0];

        let newList = new List(retrievedList.id, retrievedList.name, retrievedList.createdAt, retrievedList.order, retrievedList.currentTaskIndex);
        retrievedList.tasks.forEach(task => {
            let newTask = new Task(task.id, task.caption, task.completed, task.order);
            newList.tasks.push(newTask);
        });

        this.currentList = newList;
        this.currentList.render();

        DatabaseInfoModule.saveInfo(this.database, "App information", {key: "currentList", value: this.currentList.id});
    }

    rearrangeTasks(taskOrder) {
        taskOrder.forEach(pair => {
            let index = this.findTaskIndex(pair[0]);
            this.tasks[index].order = pair[1];
        });
        console.log(this.tasks);
    }
}

const toDo = new ToDo();

export default toDo;