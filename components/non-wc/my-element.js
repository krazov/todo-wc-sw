import { stylesheet } from "../../utils/dom.stylesheet-constructor.js";

const sheet = stylesheet({ style: `
    :host {
        background: yellow;
    }
` });

class MyElement extends HTMLElement {
    constructor() {
        super();
        this.adoptedStyleSheets = [sheet];
    }
}

customElements.define('my-element', MyElement);

// tutorial: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
