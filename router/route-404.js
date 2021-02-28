import { templateHandler } from "/utils/dom.general.util.js";

const template = `
    <h2>404</h2>
    <p>Page not found. Yeah, really.</p>
`;

function appendRoute404To(container) {
    const [, append404To] = templateHandler(template);
    append404To(container);
};

export const appendModuleTo = appendRoute404To;
