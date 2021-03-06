import { routes } from '/router/routes.js';
import { globalStyle } from '/helpers/styles-container.helper.js';
import { stylesheet } from '/utils/dom.stylesheet-constructor.js';

import '/router/route-link.js';

const resetSheet = globalStyle({ url: '/css/reset.css' });
const sheet = stylesheet({ url: '/components/app-navigation/app-navigation.css' });

class AppNavigation extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [resetSheet, sheet];

        const nav = document.createElement('nav');

        for (const route of routes.values()) {
            const link = document.createElement('a', { is: 'route-link' });

            link.textContent = route.label;
            link.title = route.title;
            link.href = route.path;

            nav.appendChild(link);
        }

        shadowRoot.appendChild(nav);
    }
}

customElements.define('app-navigation', AppNavigation);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
