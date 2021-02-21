import { templateHandler } from "../../utils/dom.general.util.js";
import { stylesheet } from "../../utils/dom.stylesheet-constructor.js";

const sheet = stylesheet({ url: '/components/todo-item/todo-item.css' });

const template = `
    <span class="id"></span>
    <span class="task"></span>
    <span class="done"></span>
`;

const editTemplate = `
    <form>
        <input type="text"></input>
    </form>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        shadow.adoptedStyleSheets = [sheet];
    }

    set todo(todo) {
        const { shadowRoot } = this;

        const [html, appendTodoTo] = templateHandler(template);
        const [edit] = templateHandler(editTemplate);

        const id = html.querySelector('.id');
        const task = html.querySelector('.task');
        const isDone = html.querySelector('.done')

        id.textContent = todo.id;
        task.textContent = todo.task;
        isDone.textContent = todo.done ? 'Done' : 'Not done';

        const form = edit.querySelector('form');
        const input = edit.querySelector('input');

        input.value = todo.task;

        appendTodoTo(shadowRoot);

        task.onclick = () => {
            shadowRoot.insertBefore(form, task);
            shadowRoot.removeChild(task);
            input.focus();
        };

        input.onblur = () => {
            shadowRoot.insertBefore(task, form);
            shadowRoot.removeChild(form);
        };

        input.onkeyup = (event) => {
            if (event.code == 'Escape') input.blur();
        };

        form.onsubmit = (event) => {
            event.preventDefault();
            input.blur();

            shadowRoot.dispatchEvent(new CustomEvent('TestEvent', {
                composed: true,
                bubbles: true,
                detail: input.value,
            }));
        };
    }
}

customElements.define('todo-item', TodoItem);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
