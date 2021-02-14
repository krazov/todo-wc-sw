import './todo-item.js';

import { LIST_UPDATED } from '../constants/db.js';

const styling = `
    :host {
        border: 1px solid var(--border-color, fuchsia);
        display: block;
        padding: 20px;
    }
`;

class TodoList extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = styling;
        shadow.appendChild(style);

        navigator.serviceWorker.onmessage = (event) => {
            const { data: { type, payload } } = event;

            if (type == LIST_UPDATED) {
                shadow.textContent = '';
                shadow.appendChild(style);

                for (const todo of payload) {
                    const todoItem = document.createElement('todo-item');
                    todoItem.todo = todo;
                    shadow.appendChild(todoItem);
                }
            }
        };
    }
}

customElements.define('todo-list', TodoList);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
