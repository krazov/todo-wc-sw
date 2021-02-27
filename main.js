import { OPEN_DB, TODO_EDIT } from './constants/db.js';
import { ServiceWorkerBus } from './workers/service-worker-bus.js';

import './components/todo-list/todo-list.js';
import './components/todo-form/todo-form.js';
import { EDITED_TODO_SUBMITTED } from './components/todo-item/todo-item-events.js';

main();

async function main() {
    console.log('Starting app...');
    await ServiceWorkerBus.init();
    await ServiceWorkerBus.request({ type: OPEN_DB });
    loadElements();
}

function loadElements() {
    const app = document.getElementById('app');

    const todoList = document.createElement('todo-list');
    app.appendChild(todoList);

    todoList.addEventListener(EDITED_TODO_SUBMITTED, ({ detail }) => {
        ServiceWorkerBus.request({
            type: TODO_EDIT,
            payload: detail,
        });
    });

    const todoForm = document.createElement('todo-form');
    app.appendChild(todoForm);

    // TODO: consider moving here the connection with ServiceWorker
}
