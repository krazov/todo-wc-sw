import './todo-item.js';

import { ServiceWorkerBus } from '../workers/service-worker-bus.js';
import { LIST_UPDATED } from '../constants/db.js';

const styling = `
    :host {
        background: var(--todo-form-bg, #eee);
        display: block;
        padding: 20px;
    }
`;

class TodoForm extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = styling;
        shadow.appendChild(style);

        const form = document.createElement('form');
    }
}

customElements.define('todo-list', TodoList);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
