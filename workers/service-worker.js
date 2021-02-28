self.addEventListener('install', function () {
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

function openDB(requestId) {
    console.log('Initiating database...');
    const request = self.indexedDB.open('todo-list', 2);

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
                isArchived: false,
            });
        };
    };

    request.onsuccess = function (event) {
        console.log('Database initialised successfully.');

        db = event.target.result;

        db.onerror = function (event) {
            console.error(`Database error: ${event.target.errorCode}`, error);
        }

        sendMessage({ id: requestId, type: 'DB_INITED' });
        broadcastTodos();
    };

    request.onerror = function () {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
}

function addTodo(requestId, todo) {
    const transaction = db.transaction(['todos'], 'readwrite');
    transaction.oncomplete = () => {};
    transaction.onerror = (event) => {
        sendMessage({
            id: requestId,
            type: 'TODO_NOT_ADDED',
            error: event,
        });
    };

    const todosObjectStore = transaction.objectStore('todos')
    const idIndexCursor = todosObjectStore.index('id').openCursor(null, 'prev');
    idIndexCursor.onsuccess = (event) => {
        const latestId = event.target.result.key;
        const newTodo = {
            id: latestId + 1,
            task: todo,
            isDone: false,
            isArchived: false,
        };
        const request = todosObjectStore.add(newTodo);

        request.onsuccess = () => {
            sendMessage({
                id: requestId,
                type: 'TODO_ADDED',
                payload: newTodo,
            });

            broadcastTodos();
        };
    };
}

function editTodo(requestId, todo) {
    const transaction = db.transaction(['todos'], 'readwrite');
    transaction.oncomplete = () => {};
    transaction.onerror = (event) => {
        sendMessage({
            id: requestId,
            type: 'TODO_NOT_EDITED',
            error: event,
        });
    };

    const todosObjectStore = transaction.objectStore('todos')
    const idIndexCursor = todosObjectStore.get(todo.id)
    idIndexCursor.onsuccess = (event) => {
        const updatedTodo = {
            ...event.target.result,
            task: todo.task,
            isDone: todo.isDone,
            isArchived: todo.isArchived,
        };
        const request = todosObjectStore.put(updatedTodo);

        request.onsuccess = () => {
            sendMessage({
                id: requestId,
                type: 'TODO_EDITED',
                payload: updatedTodo,
            });

            broadcastTodos();
        };
    };
}

async function broadcastTodos() {
    sendMessage({
        type: 'LIST_UPDATED',
        payload: await allTodos(),
    });
}

async function fetchTodos(requestId) {
    sendMessage({
        id: requestId,
        type: 'TODOS_FETCHED',
        payload: await allTodos(),
    });
}

function allTodos() {
    return new Promise((resolve) => {
        const todosList = [];
        const todosObjectStore = db.transaction('todos', 'readwrite').objectStore('todos');

        todosObjectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                todosList.push(cursor.value);
                cursor.continue();
            } else {
                resolve(todosList);
            }
        };
    });
}

self.onmessage = async function (event) {
    const { data: { id, type, payload } } = event;

    switch (type) {
        case 'OPEN_DB':
            openDB(id);
            break;
        case 'TODOS_FETCH':
            fetchTodos(id);
            break;
        case 'TODO_ADD':
            addTodo(id, payload);
            break;
        case 'TODO_EDIT':
            editTodo(id, payload);
            break;
    }
};

// can be cleared here: brave://serviceworker-internals/
// indexedDB tutorial: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
