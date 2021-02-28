import { ServiceWorkerBus } from './workers/service-worker-bus.js';
import { routes } from './router/routes.js';

import { OPEN_DB } from './constants/db.js';

import '/components/app-navigation/app-navigation-component.js';
import '/router/app-router.js';

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

    const appRouter = document.createElement('app-router');
    app.appendChild(appRouter);

    // TODO: consider moving here the connection with ServiceWorker
}
