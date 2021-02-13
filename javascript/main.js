import { registerServiceWorker } from './workers/register-service-worker.js';
import { INIT_DB } from './constants/db.js';

async function main() {
    console.log('Starting app...');

    const serviceWorker = await registerServiceWorker('/javascript/workers/service-worker.js');

    navigator.serviceWorker.addEventListener('message', function (event) {
        console.log(event.data);
    });

    serviceWorker.postMessage({ type: INIT_DB });
}

main();
