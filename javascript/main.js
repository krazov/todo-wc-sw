
import { OPEN_DB } from './constants/db.js';
import { ServiceWorkerBus } from './workers/service-worker-bus.js';

import './components/todo-list.js';
import './components/todo-form.js';

main();

async function main() {
    console.log('Starting app...');
    await ServiceWorkerBus.init();
    await ServiceWorkerBus.request({ type: OPEN_DB });
    loadList();
}

function loadList() {
    const app = document.getElementById('app');

    const todoList = document.createElement('todo-list');
    app.appendChild(todoList);

    const todoForm = document.createElement('todo-form');
    app.appendChild(todoForm);
}
