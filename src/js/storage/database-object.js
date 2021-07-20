import * as DatabaseModule from './database-management-module.js';

/**
 * An IndexedDB database object
 * @type {Object}
 */
const database = await DatabaseModule.openDatabase("The Ultimate To-Do List", 1, [
  {
    name: "Lists", keyOptions: {keyPath: "id", autoincrement: false}
  },
  {
    name: "App information"
  },
  {
    name: "Custom preferences"
  }
]);

Object.freeze(database);
export default database;