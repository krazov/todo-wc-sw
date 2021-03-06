export const PAGE_REQUESTED = 'pageRequested';

export const pageRequestedEvent = (pathname) =>
    new CustomEvent(PAGE_REQUESTED, {
        composed: true,
        bubbles: true,
        detail: { pathname },
    });
