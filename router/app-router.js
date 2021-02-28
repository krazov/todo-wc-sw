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
