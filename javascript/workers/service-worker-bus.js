import { registerServiceWorker } from './register-service-worker.js';

let id = 0;
const latestId = () => ++id;

let serviceWorker = null;
let requestors = new Map;
const listeners = new Map;

navigator.serviceWorker.onmessage = (event) => {
    const { data: { id, type, payload } } = event;

    console.log('Message from ServiceWorker', {
        ...(id ? { id } : null),
        type,
        ...(payload ? { payload } : null),
    });

    if (id && requestors.has(id)) {
        requestors.get(id).resolve({ type, payload });
        requestors.delete(id);
    } else if (listeners.has(type)) {
        for (const handler of listeners.get(type)) {
            handler(payload);
        }
    }
};

async function init() {
    serviceWorker = await registerServiceWorker('/javascript/workers/service-worker.js');
};

function request({ type, payload }) {
    return new Promise((resolve, reject) => {
        const id = latestId();

        requestors.set(id, { resolve, reject });

        serviceWorker.postMessage({
            id,
            type,
            ...(payload === undefined ? null : { payload }),
        });
    });
};

function subscribe(type, handler) {
    if (typeof handler != 'function') {
        throw Error('Handler has to be a function!');
    }

    if (!listeners.has(type)) {
        listeners.set(type, []);
    }

    listeners.get(type).push(handler);
}

export const ServiceWorkerBus = {
    init,
    request,
    subscribe,
};
