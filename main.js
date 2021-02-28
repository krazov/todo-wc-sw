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

    window.onclick = (event) => {
        const link = event.path.find(node => node.nodeName == 'A');

        const shouldHijackClick =
            link?.host == window.location.host &&
            link.target == '' &&
            routes.has(link.pathname);

        if (shouldHijackClick) {
            event.preventDefault();

            if (link.pathname != window.location.pathname) {
                const state = {
                    path: link.pathname,
                };

                window.history.pushState(state, routes.get(link.pathname).title, link.href);
                window.dispatchEvent(new PopStateEvent('popstate', { state }));
            }
        }
    };

    // TODO: consider moving here the connection with ServiceWorker
}
