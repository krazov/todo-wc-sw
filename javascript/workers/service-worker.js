self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('ServiceWorker installed.');
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
    console.log('ServiceWorker activated.');
});

async function sendMessage(message) {
    const [client] = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    });

    client && client.postMessage(message);
}

let db = null;

function openDB(id) {
    console.log('Initiating database...');
    const request = self.indexedDB.open('todo-list', 1);

    request.onupgradeneeded = function (event) {
        console.log('Database upgrade needed.');

        db = event.target.result;

        const objectStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('task', 'task', { unique: false });
        objectStore.createIndex('isDone', 'isDone', { unique: false });

        objectStore.transaction.oncomplete = async function (event) {
            const todosObjectStore = db.transaction('todos', 'readwrite').objectStore('todos');
            todosObjectStore.add({
                id: 1,
                task: 'An example todo',
                isDone: false,
            });
        };
    };

    request.onsuccess = function (event) {
        console.log('Database initialised successfully.');

        db = event.target.result;

        db.onerror = function (event) {
            console.error(`Database error: ${event.target.errorCode}`);
        }

        sendMessage({ id, type: 'DB_INITED' });

        const allTodos = [];
        const todosObjectStore = db.transaction('todos', 'readwrite').objectStore('todos');

        todosObjectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                allTodos.push(cursor.value);
                cursor.continue();
            } else {
                sendMessage({
                    type: 'LIST_UPDATED',
                    payload: allTodos,
                });
            }
        };
    };

    request.onerror = function (event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
}

function addContact({ todo, isDone }) {}

self.onmessage = async function (event) {
    const {
        data,
        data: { id, type },
    } = event;

    switch (type) {
        case 'OPEN_DB':
            openDB(id);
            break;
        case 'CONTACT_ADD':
            break;
    }
};

// can be cleared here: brave://serviceworker-internals/
// indexedDB tutorial: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
