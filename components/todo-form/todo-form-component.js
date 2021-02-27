import { ServiceWorkerBus } from '../../workers/service-worker-bus.js';
import { TODO_ADD } from '../../constants/db.js';
import { stylesheet } from '../../utils/dom.stylesheet-constructor.js';
import { templateHandler } from '../../utils/dom.general.util.js';
import { globalStyle } from '../../helpers/styles-container.helper.js';

const resetSheet = globalStyle({ url: '/css/reset.css' });
const sheet = stylesheet({ url: '/components/todo-form/todo-form.css'});

const template = `
    <form>
        <fieldset>
            <legend>A new task</legend>
            <input type="text">
            <button>Add</button>
        </fieldset>
    </form>
`;

class TodoForm extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [resetSheet, sheet];

        const [html, appendFormTo] = templateHandler(template);
        const form = html.querySelector('form');
        const input = html.querySelector('input');

        appendFormTo(shadowRoot);

        let isSubmitting = false;
        form.onsubmit = async (event) => {
            event.preventDefault();

            if (isSubmitting) return;

            isSubmitting = true;

            await ServiceWorkerBus.request({
                type: TODO_ADD,
                payload: input.value,
            });

            isSubmitting = false;
            input.value = '';
        };
    }
}

customElements.define('todo-form', TodoForm);
