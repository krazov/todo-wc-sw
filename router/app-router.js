import { routes } from '/router/routes.js';

function loadModule(pathname) {
    return routes.has(pathname)
        ? routes.get(pathname).module()
        : import('/router/route-404.js');
}

class AppRouter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.loadRoute(window.location.pathname);

        window.onpopstate = (event) => {
            console.log('Navigation happened!', event);

            const path = event?.state?.path;
            if (!path) throw Error('Incomplete data on the event!');
            this.loadRoute(path);
        };
    }

    async loadRoute(pathname) {
        const { shadowRoot } = this;

        try {
            const { appendModuleTo } = await loadModule(pathname);
            shadowRoot.textContent = '';
            appendModuleTo(shadowRoot);
        } catch(error) {
            console.error(error);
        }
    }
}

customElements.define('app-router', AppRouter);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
