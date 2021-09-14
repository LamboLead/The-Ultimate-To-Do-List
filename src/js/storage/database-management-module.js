/**
 * This is the database-management module.<br>
 * It stores functions related to the opening, store creation and deletion of an IndexedDB database.
 * @module Storage/database-management
*/

/**
 * Creates and returns a promise for an IndexedDB database object
 * @async
 * @function openDatabase
 * @param {string} dbName Database's name
 * @param {number} dbVersion Database's version
 * @param {Array<Object>} objectStoresArr Array of object stores. @link createStores
 * @returns {Promise}
 * @example
 * const database = await openDatabase(
 * 	"The Ultimate To-Do list",
 * 	1,
 * 	[
 * 		{name: "Lists", keyOptions: {keyPath: "id", autoincrement: false}},
 * 		{name: "App information"},
 * 		{name: "Custom preferences"}
 * 	]
 * );
 */
export async function openDatabase(dbName, dbVersion = 1, objectStoresArr) {
    let promise = new Promise((resolve, reject) => {
        let openRequest = indexedDB.open(dbName, dbVersion);
        openRequest.onupgradeneeded = () => {
            console.log("Updating database...");
            let database = openRequest.result;
			createStores(database, objectStoresArr);
        }
        openRequest.onerror = (e) => {
            reject(Error("Unable to connect to database"));
            console.log("Error!", e);
        }
        openRequest.onsuccess = () => {
            console.log("Database connected successfully!");
            let database = openRequest.result;
            resolve(database);
        }
    });
    return await promise.then();
}

/**
 * Deletes the specified IndexedDB database
 * @function deleteDatabase
 * @param {string} dbName Name of the database to delete
 * @returns {void}
 */
export function deleteDatabase(dbName) {
    let deleteRequest = indexedDB.deleteDatabase(dbName);
    deleteRequest.onsuccess = () => {console.log("Database successfully deleted")}
    deleteRequest.onerror = (e) => {console.log("Unable to delete database", e)}
}

/**
 * Creates specified object stores inside an IndexedDB database on the onupdateneeded event
 * @async
 * @function createStores
 * @param {Object} IDBObject IndexedDB database object
 * @param {Array<Object>} objectStoresArr Array of objects containing settings for object stores
 * @returns {Promise<void>}
 * @example
 * createStores(database,
 * 	[
 * 		{name: "Lists", keyOptions: {keyPath: "id", autoincrement: false}},
 * 		{name: "App information"},
 * 		{name: "Custom preferences"}
 * 	]
 * );
 */
export async function createStores(IDBObject, objectStoresArr) {
    console.log("Creating object stores...");
    let promise = new Promise((resolve, reject) => {
        objectStoresArr.forEach(store => {
            let name = store.name;
            let keyOptions = store.keyOptions;
            let indexes = store.indexes;
            console.log(`Creating object store '${name}'`);
            let newStore;

            if (keyOptions) {
                newStore = IDBObject.createObjectStore(name, {
                    keyPath: keyOptions.keyPath,
                    autoIncrement: keyOptions.autoIncrement
                });
            } else {
                newStore = IDBObject.createObjectStore(name);
            }

            if (indexes) {
                indexes.forEach(index => {
                    console.log(`Creating index '${index.name}' for store '${name}'`);
                    newStore.createIndex(index.name, index.relatesTo);
                });
            }
        });
        resolve("Object stores created successfully!");
        reject(Error("Unable to create object stores"));
    });
    console.log(await promise.then());
}
