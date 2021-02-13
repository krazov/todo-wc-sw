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

function initDb() {
    console.log('Initiating database...');
    const request = self.indexedDB.open('todo-list', 1);

    request.onupgradeneeded = function (event) {
        console.log('Database upgrade needed.');

        db = event.target.result;

        const objectStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('todo', 'todo', { unique: false });
        objectStore.createIndex('isDone', 'isDone', { unique: false });
        objectStore.transaction.oncomplete = function (event) {
            const todosObjectStore = db.transaction('todos', 'readwrite').objectStore('todos');
            todosObjectStore.add({
                id: 1,
                todo: 'An example todo',
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
    };

    request.onerror = function (event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
}

function addContact({ todo, isDone }) {
    db
}

self.addEventListener('message', async function (event) {
    const {
        data,
        data: { type },
    } = event;

    sendMessage({ status: 'Message received', data });

    switch (type) {
        case 'INIT_DB':
            initDb();
            break;
        case 'CONTACT_ADD':
            break;
    }
});
