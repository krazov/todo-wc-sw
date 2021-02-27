import { ServiceWorkerBus } from '../../workers/service-worker-bus.js';
import { SERVICE_WORKER_UPDATE } from '../../workers/events.js';
import { LIST_UPDATED } from '../../constants/db.js';
import { stylesheet } from '../../utils/dom.stylesheet-constructor.js';

import '../todo-item/todo-item-component.js';

const sheet = stylesheet({ url: '/components/todo-list/todo-list.css' });

const compareTodos = (a, b) =>
    a.isDone && !b.isDone
        ? 1
        : !a.isDone && b.isDone
            ? -1
            : a.id - b.id;

class TodoList extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [sheet];

        ServiceWorkerBus.subscribe(this);

        this.addEventListener(SERVICE_WORKER_UPDATE, (event) => {
            const { detail: { type, payload } } = event;

            if (type != LIST_UPDATED) return;

            for (const oldTodoItem of shadowRoot.querySelectorAll('todo-item')) {
                shadowRoot.removeChild(oldTodoItem);
            }

            const sortedList = [...payload].sort(compareTodos);

            for (const todo of sortedList) {
                const todoItem = document.createElement('todo-item');
                todoItem.todo = todo;
                shadowRoot.appendChild(todoItem);
            }
        });
    }
}

customElements.define('todo-list', TodoList);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
