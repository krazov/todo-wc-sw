import { registerServiceWorker } from './register-service-worker.js';
import { listUpdated } from './events.js';

let id = 0;
const latestId = () => ++id;

let serviceWorker = null;
const requestors = new Map;
const subscribers = new Set;
const trueSubscribers = new WeakSet;

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
    } else for (const component of subscribers) {
        component.dispatchEvent(listUpdated(type, payload));
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

function subscribe(component) {
    subscribers.add(component);
    trueSubscribers.add(component);

    // while we’re at it, let’s check unused subscribers
    for (const subscriber of subscribers) {
        if (trueSubscribers.has(subscriber)) continue;
        subscribers.delete(subscriber);
    }
}

export const ServiceWorkerBus = {
    init,
    request,
    subscribe,
};
