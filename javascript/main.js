
import { OPEN_DB, DB_INITED } from './constants/db.js';
import { ServiceWorkerBus } from './workers/service-worker-bus.js';
import './components/todo-list.js';

main();

async function main() {
    console.log('Starting app...');
    await ServiceWorkerBus.init();
    await ServiceWorkerBus.request({ type: OPEN_DB });
    loadList();
}

function loadList() {
    const todoList = document.createElement('todo-list');
    document.getElementById('app').appendChild(todoList);
}
