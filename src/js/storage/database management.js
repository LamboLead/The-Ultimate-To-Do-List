async function openDatabase(dbName, dbVersion = 1) {
    /*
        Creates, updates and returns an IndexedDB database as an object
    */
    let promise = new Promise((resolve, reject) => {
        let openRequest = indexedDB.open(dbName, dbVersion);
        openRequest.onupgradeneeded = () => {
            console.log("Updating database...");
            let database = openRequest.result;
            createStores([database,
                {
                    name: "Lists",
                    keyOptions: {keyPath: "id", autoIncrement: false}
                },
                {
                    name: "App information"
                },
                {
                    name: "Preferences"
                }
            ]);
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

function deleteDatabase(dbName) {
    let deleteRequest = indexedDB.deleteDatabase(dbName);
    deleteRequest.onsuccess = () => {console.log("Database successfully deleted")}
    deleteRequest.onerror = (e) => {console.log("Unable to delete database", e)}
}

async function createStores(...args) {
    console.log("Creating object stores...");
    let promise = new Promise((resolve, reject) => {
        let database = args[0][0];
        let objectStores = args[0].slice(1);

        objectStores.forEach(store => {
            let name = store.name;
            let keyOptions = store.keyOptions;
            let indexes = store.indexes;
            console.log(`Creating object store '${name}'`);
            let newStore;

            if (keyOptions) {
                newStore = database.createObjectStore(name, {
                    keyPath: keyOptions.keyPath,
                    autoIncrement: keyOptions.autoIncrement
                });
            } else {
                newStore = database.createObjectStore(name);
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

const database = await openDatabase("The Ultimate To-Do List");

Object.freeze(database);
export default database;