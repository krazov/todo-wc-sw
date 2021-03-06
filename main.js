import { ServiceWorkerBus } from '/workers/service-worker-bus.js';

import { OPEN_DB } from '/constants/db.js';
import { PAGE_REQUESTED } from '/router/router.events.js';
import { routes } from '/router/routes.js';

import '/components/app-navigation/app-navigation-component.js';
import '/router/app-router.js';

main();

async function main() {
    console.log('Starting app...');
    await ServiceWorkerBus.init();
    await ServiceWorkerBus.request({ type: OPEN_DB });

    const app = document.getElementById('app');

    const appNavigation = document.createElement('app-navigation');
    app.appendChild(appNavigation);

    const appRouter = document.createElement('app-router');
    app.appendChild(appRouter);

    app.addEventListener(PAGE_REQUESTED, (event) => {
        const { detail: { pathname } } = event;

        const isAlreadyThere = pathname == window.location.pathname;
        if (isAlreadyThere) return;

        const isWrongRoute = !routes.has(pathname);
        if (isWrongRoute) throw Error('Passed route does not belong to the app.');

        const state = {
            path: pathname,
        };

        window.history.pushState(state, routes.get(pathname).title, pathname);
        window.dispatchEvent(new PopStateEvent('popstate', { state }));
    });

    // TODO: consider moving here the connection with ServiceWorker
}
