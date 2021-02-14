const styling = `
    :host {
        border-bottom: 1px solid #eee;
        display: block;
        padding: 10px;
    }
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
        this.shadowRoot.appendChild(document.createTextNode(todo.task));
    }
}

customElements.define('todo-item', TodoItem);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
