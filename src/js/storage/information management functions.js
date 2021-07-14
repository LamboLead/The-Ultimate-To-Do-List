export async function retrieveInfo(database, storeName, {query} = {}) {
    let promise = new Promise((resolve, reject) => {
        let transaction = database.transaction(storeName, "readonly");
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

export async function saveInfo(database, storeName, {key, value} = {value}) {
    let promise = new Promise((resolve, reject) => {
        let transaction = database.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request;
        if (key) {
            request = store.put(value, key);
        } else {
            request = store.put(value);
        }
        request.onerror = (e) => {
            reject(Error("Unable to save data", e));
        }
        request.onsuccess = () => {
            resolve(`Data saved successfully in store '${storeName}'`);
        }
    });
    console.log(await promise.then());
}

export async function deleteInfo(database, storeName, {key} = {}) {
    let promise = new Promise((resolve, reject) => {
        let transaction = database.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request;
        if (key) {
            request = store.delete(key);
        } else {
            request = store.clear();
        }
        request.onerror = (e) => {
            reject(Error("Unable to delete data", e));
        }
        request.onsuccess = () => {
            resolve("Deleted data successfully");
        }
    });
    console.log(await promise.then());
}