const status = (registration) =>
    registration.installing
        ? 'installing'
        : registration.waiting
            ? 'waiting'
            : registration.active
                ? 'active'
                : 'of unknown status';

export async function registerServiceWorker(path) {
    try {
        const registration = await navigator.serviceWorker.register(path);

        console.log(`ServiceWorker "${path}" is ${status(registration)}.`);

        return registration.installing || registration.waiting || registration.active;
    } catch (error) {
        console.log('An error has occured while registering a ServiceWorker.');
        console.error(error);
    }
}