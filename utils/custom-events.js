export const customEvent = (name, detail = {}) =>
    new CustomEvent(name, {
        composed: true,
        bubbles: true,
        detail,
    });
