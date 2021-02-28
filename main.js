import { ServiceWorkerBus } from './workers/service-worker-bus.js';

import { OPEN_DB, TODO_EDIT } from './constants/db.js';
import { EDITED_TODO_SUBMITTED } from './components/todo-item/todo-item-events.js';

import './components/app-navigation/app-navigation-component.js';
import './components/todo-list/todo-list-component.js';
import './components/todo-form/todo-form-component.js';

main();

async function main() {
    console.log('Starting app...');
    await ServiceWorkerBus.init();
    await ServiceWorkerBus.request({ type: OPEN_DB });
    loadElements();
}

function loadElements() {
    const app = document.getElementById('app');

    const appNavigation = document.createElement('app-navigation');
    app.appendChild(appNavigation);

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

    window.onclick = (event) => {
        const link = event.path.find(node => node.nodeName == 'A');

        if (link?.host == window.location.host && link.target == '') {
            event.preventDefault();
            history.pushState({}, 'Test', link.href);
        }
    };

    // TODO: consider moving here the connection with ServiceWorker
}
