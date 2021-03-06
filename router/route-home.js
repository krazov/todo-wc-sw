import { EDITED_TODO_SUBMITTED } from '/components/todo-item/todo-item-events.js';
import { TODO_EDIT } from '/constants/db.js';

import { ServiceWorkerBus } from '/workers/service-worker-bus.js';

import '/components/todo-list/todo-list-component.js';
import '/components/todo-form/todo-form-component.js';

function appendRouteHomeTo(container) {
    const todoList = document.createElement('todo-list');
    container.appendChild(todoList);

    todoList.addEventListener(EDITED_TODO_SUBMITTED, ({ detail }) => {
        ServiceWorkerBus.request({
            type: TODO_EDIT,
            payload: detail,
        });
    });

    const todoForm = document.createElement('todo-form');
    container.appendChild(todoForm);
};

export const appendModuleTo = appendRouteHomeTo;
