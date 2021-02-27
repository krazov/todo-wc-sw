import { templateHandler } from "../../utils/dom.general.util.js";
import { stylesheet } from "../../utils/dom.stylesheet-constructor.js";
import { customEvent } from "../../utils/custom-events.js";
import { EDITED_TODO_SUBMITTED } from "./todo-item-events.js";
import { globalStyle } from "../../helpers/styles-container.js";

const resetSheet = globalStyle({ url: '/css/reset.css' });
const sheet = stylesheet({ url: '/components/todo-item/todo-item.css' });

const template = `
    <span class="id"></span>
    <span class="task"></span>
    <button class="done"></button>
`;

const editTemplate = `
    <form>
        <input type="text"></input>
    </form>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [resetSheet, sheet];
    }

    set todo(todo) {
        const { shadowRoot } = this;

        const [html, appendTodoTo] = templateHandler(template);
        const [edit] = templateHandler(editTemplate);

        console.log('Setting todo:', todo);

        const id = html.querySelector('.id');
        id.textContent = todo.id;

        const task = html.querySelector('.task');
        task.textContent = todo.task;

        task.onclick = () => {
            shadowRoot.insertBefore(form, task);
            shadowRoot.removeChild(task);
            input.focus();
        };

        const buttonDone = html.querySelector('.done')
        buttonDone.textContent = todo.isDone ? 'Mark undone' : 'Mark done';
        buttonDone.classList.toggle('is-done', todo.isDone);
        buttonDone.onclick = () => {
            shadowRoot.dispatchEvent(customEvent(EDITED_TODO_SUBMITTED, {
                ...todo,
                isDone: !todo.isDone,
            }));
        };

        const form = edit.querySelector('form');
        form.onsubmit = (event) => {
            event.preventDefault();
            input.blur();

            shadowRoot.dispatchEvent(customEvent(EDITED_TODO_SUBMITTED, {
                ...todo,
                task: input.value,
            }));
        };

        const input = edit.querySelector('input');
        input.onblur = () => {
            shadowRoot.insertBefore(task, form);
            shadowRoot.removeChild(form);
        };
        input.onkeyup = (event) => {
            if (event.code == 'Escape') input.blur();
        };
        input.value = todo.task;

        appendTodoTo(shadowRoot);
    }
}

customElements.define('todo-item', TodoItem);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
