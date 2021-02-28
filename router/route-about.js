import { templateHandler } from "/utils/dom.general.util.js";

const template = `
    <h2>About</h2>
    <p>Route under construction!</p>
    <p>TODO: it will use static HTML page loaded from the source</p>
    <p>under-construction.jpeg</p>
`;

function appendRoute404To(container) {
    const [, appendArchivedTodosTo] = templateHandler(template);
    appendArchivedTodosTo(container);
};

export const appendModuleTo = appendRoute404To;
