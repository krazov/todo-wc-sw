export const SERVICE_WORKER_UPDATE = 'serviceWorkerUpdate';

export const listUpdated = (type, payload) =>
    new CustomEvent(SERVICE_WORKER_UPDATE, {
        detail: { type, payload },
    });
