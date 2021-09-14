/**
 * This is the information-management module.<br>
 * It exports functions related to retrieving, saving, updating and deleting information from an IndexedDB database.
 * @module Storage/information-management
*/

/**
 * Returns a promise containing information stored in the IndexedDB database
 * @function module:Storage/information-management.retrieveInfo
 * @async
 * @param {Object} IDBObject An IDB database object
 * @param {string} storeName Name of the object store
 * @param {Object} info Information to look for
 * @param {string} [info.query] Identifier of the specific information to retrieve
 * @returns {Promise<*>}
 * @example
 * let information = await retrieveInfo(database, "Lists", {query: "list1"});
 */
export async function retrieveInfo(IDBObject, storeName, {query} = {}) {
	let promise = new Promise((resolve, reject) => {
		let transaction = IDBObject.transaction(storeName, "readonly");
		let store = transaction.objectStore(storeName);
		let request;
		if (!query) {
			request = store.getAll();
		} else {
			request = store.getAll(query);
		}
		request.onerror = () => {
			reject(Error("Unable to retrieve data"));
		}
		request.onsuccess = () => {
			resolve(request.result);
		}
	});
	return await promise.then();
}

/**
 * Saves information into the specified database and store
 * @function saveInfo
 * @param {Object} IDBObject An IDB database object
 * @param {string} storeName Name of the object store
 * @param {Object} info Information to store
 * @param {string} [info.key] Key of the value to store
 * @param {*} info.value Value to store
 * @example
 * await saveInfo(database, "Lists", {key: "list2", value: {foo: "baz"}});
 */
export function saveInfo(IDBObject, storeName, {key, value} = {value}) {
	let promise = new Promise((resolve, reject) => {
		let transaction = IDBObject.transaction(storeName, "readwrite");
		let store = transaction.objectStore(storeName);
		let request;
		if (key) {
			request = store.put(value, key);
		} else {
			request = store.put(value);
		}
		request.onerror = (e) => {
			reject(Error(`Unable to save data: ${e}`));
		}
		request.onsuccess = () => {
			resolve(`Data saved successfully in store '${storeName}'`);
		}
	});
	promise.then((result) => console.log(result));
}

/**
 * Deletes information from the specified database and store
 * @function deleteInfo
 * @param {Object} IDBObject IDB database object
 * @param {string} storeName Name of the object store
 * @param {Object} info Information to delete
 * @param {string} [info.key] Key of the value to delete
 * @example
 * await deleteInfo(database, "Lists", {key: "list3"})
 */
export function deleteInfo(IDBObject, storeName, {key} = {}) {
	let promise = new Promise((resolve, reject) => {
		let transaction = IDBObject.transaction(storeName, "readwrite");
		let store = transaction.objectStore(storeName);
		let request;
		if (key) {
			request = store.delete(key);
		} else {
			request = store.clear();
		}
		request.onerror = (error) => {
			reject(Error(`Unable to delete data ${error}`));
		}
		request.onsuccess = () => {
			resolve("Deleted data successfully");
		}
	});
	promise.then((result) => console.log(result));
}