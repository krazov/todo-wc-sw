import { registerServiceWorker } from './workers/register-service-worker.js';
import { INIT_DB, DB_INITED } from './constants/db.js';

import './components/todo-list.js';

main();

async function main() {
    console.log('Starting app...');

    const serviceWorker = await registerServiceWorker('/javascript/workers/service-worker.js');

    navigator.serviceWorker.onmessage = (event) => {
        const { data: { type, payload } } = event;

        console.log(payload ? { type, payload } : { type });
        
        if (type == DB_INITED) {
            console.log('DB inited.');
            loadList();
        }
    };

    serviceWorker.postMessage({ type: INIT_DB });
}

function loadList() {
    const todoList = document.createElement('todo-list');
    document.getElementById('app').appendChild(todoList);
}
