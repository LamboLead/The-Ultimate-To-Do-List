/**
 * This is the database module.<br>
 * It exports an IndexedDB database object.
 * @module Storage/database
*/

import * as DatabaseModule from './database-management-module.js';

/**
 * An IndexedDB database object
 * @type {IDBDatabase}
 */
const database = await DatabaseModule.openDatabase("The Ultimate To-Do List", 1, [
  {
    name: "Lists", keyOptions: {keyPath: "id", autoincrement: false}
  },
  {
    name: "To-do information"
  },
  {
    name: "Custom preferences"
  }
]);

Object.freeze(database);
export default database;