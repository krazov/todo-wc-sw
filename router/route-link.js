import { pageRequestedEvent } from "./router.events.js";

class RouteLink extends HTMLAnchorElement {
    constructor() {
        super();

        this.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            // TODO: consider checking route here

            this.dispatchEvent(pageRequestedEvent(event?.currentTarget?.pathname));
        });
    }
}

customElements.define('route-link', RouteLink, { extends: 'a' });
