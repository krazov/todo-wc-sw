import { templateHandler } from "../../utils/dom.general.util.js";
import { stylesheet } from "../../utils/dom.stylesheet-constructor.js";
import { customEvent } from "../../utils/custom-events.util.js";
import { EDITED_TODO_SUBMITTED } from "./todo-item-events.js";
import { globalStyle } from "../../helpers/styles-container.helper.js";
import { isActiveTodo, isUnfinishedTodo } from "../../utils/todo.util.js";

const resetSheet = globalStyle({ url: '/css/reset.css' });
const formSheet = globalStyle({ url: '/css/form.css' });
const todoItemSheet = stylesheet({ url: '/components/todo-item/todo-item.css' });

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

const editedTodoEvent = customEvent.bind(null, EDITED_TODO_SUBMITTED);

class TodoItem extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [resetSheet, formSheet, todoItemSheet];
    }

    set todo(todo) {
        const { shadowRoot } = this;

        const [html, appendTodoTo] = templateHandler(template);
        const [edit] = templateHandler(editTemplate);

        console.log('Setting todo:', todo);

        this.classList.toggle('is-done', todo.isDone)

        const id = html.querySelector('.id');
        id.textContent = todo.id;

        const task = html.querySelector('.task');
        task.textContent = todo.task;

        task.onclick = () => {
            if (todo.isDone) return;

            shadowRoot.insertBefore(form, task);
            shadowRoot.removeChild(task);
            input.focus();
        };

        const buttonDone = html.querySelector('.done')
        buttonDone.textContent = isUnfinishedTodo(todo)
            ? 'Mark done'
            : isActiveTodo
                ? 'Archive'
                : '—';
        buttonDone.onclick = () => {
            const payload = !todo.isDone
                ? { isDone: true }
                : !todo.isArchived
                    ? { isArchived: true }
                    : null;

            shadowRoot.dispatchEvent(editedTodoEvent({
                ...todo,
                ...payload,
            }));
        };

        const form = edit.querySelector('form');
        form.onsubmit = (event) => {
            event.preventDefault();
            input.blur();

            shadowRoot.dispatchEvent(editedTodoEvent({
                ...todo,
                task: input.value,
            }));
        };

        const input = edit.querySelector('input');
        input.value = todo.task;
        input.onblur = () => {
            shadowRoot.insertBefore(task, form);
            shadowRoot.removeChild(form);
        };
        input.onkeyup = (event) => {
            if (event.code == 'Escape') input.blur();
        };

        appendTodoTo(shadowRoot);
    }
}

customElements.define('todo-item', TodoItem);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
