import { templateHandler } from "/utils/dom.general.util.js";

const template = `
    <h2>Archived todos</h2>
    <p>Route under construction!</p>
    <p>under-construction.jpeg</p>
`;

function appendRoute404To(container) {
    const [, appendArchivedTodosTo] = templateHandler(template);
    appendArchivedTodosTo(container);
};

export const appendModuleTo = appendRoute404To;
