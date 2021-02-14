import { ServiceWorkerBus } from '../workers/service-worker-bus.js';
import { TODO_ADD } from '../constants/db.js';

const styling = `
    :host {
        background: var(--todo-form-bg, #ddd);
        display: block;
        padding: 20px;
    }
    legend {
        background-color: var(--todo-form-legend-bg, #eee);
        padding: 3px 12px;
    }
    fieldset {
        border: 1px solid var(--todo-form-legend-border, #666);
        display: flex;
        justify-content: space-between;
    }
    input,
    button {
        font-family: Calibri, sans-serif;
    }
    input {
        background-color: var(--todo-form-input-bg, #fff);
        border-width: 0;
        padding: 5px 10px;
    }
    button {
        background-color: var(--todo-form-button-bg, #006400);
        border-radius: 0;
        border-width: 0;
        color: var(--todo-form-button-color, #fff);
        padding: 5px 10px;

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
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = 'A new task';
        const input = document.createElement('input');
        const button = document.createElement('button');
        button.textContent = 'Add';

        shadow.appendChild(form);
        form.appendChild(fieldset);
        fieldset.appendChild(legend);
        fieldset.appendChild(input);
        fieldset.appendChild(button);

        form.onsubmit = async (event) => {
            event.preventDefault();

            await ServiceWorkerBus.request({
                type: TODO_ADD,
                payload: input.value,
            });

            input.value = '';
        };
    }
}

customElements.define('todo-form', TodoForm);
