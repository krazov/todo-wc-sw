import { templateHandler } from "../utils/dom.general.util.js";

const styling = `
    :host {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
    .id:before {
        content: '#';
        color: var(--todo-item-hash-color, #ccc);
    }
`;

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

        const style = document.createElement('style');
        style.textContent = styling;
        shadow.appendChild(style);
    }

    set todo(todo) {
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

        appendTodoTo(this.shadowRoot);

        task.onclick = () => {
            this.shadowRoot.insertBefore(edit, task);
            this.shadowRoot.removeChild(task);
        };

        form.onsubmit = (event) => {
            event.preventDefault();
            console.log('New value', input.value);

            this.shadowRoot.insertBefore(task, form);
            this.shadowRoot.removeChild(form);
        };
    }
}

customElements.define('todo-item', TodoItem);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
