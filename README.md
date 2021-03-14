# Todo List Water Closet Star Wars

I haven’t done a todo list in a while. This time, there’s gonna be use WebComponents (`-wc-`) and ServiceWorker (`-sw-`) which additionally utilises IndexedDB. Then, a colleague told me about constructable style sheets, and I threw them into mix.

## Running the thing

1. Clone the repo.
2. Run static server in the root folder.

## Technologies used

### WebComponents

A minimum building unit for the project are now components, each encapsulating markup and accompanying logic. At the moment, some components are smart, but the long-game is to have them dumb and just bubbling events which can be picked up by components higher in the hierarchy (initially, the `main` function was intended for that).

### ServiceWorker

To make it lighter for the main thread, also known as UI thread, all IndexedDB operations have been moved to ServiceWorker.

### IndexedDB

No more synchronous localStorage. Which was the condition to go full Worker.

### Constructable style sheets

To avoid CSS bloat when `<style></style>` tag is added in every component (lists, anyone?), stylesheets are calculated and shared between various components.

CSS is taken from accompanying CSS files.

## Some notes on the thing

As of March 13th, 2021 I lost interest in continuing the project, so I’ll just leave some notes on what I learned. I might pick up development later but unlikely. However, this is fine because this project’s purpose was not creating something production-ready, but exploring new concepts.

### WebComponents

Defining and registering is quite easy. There are two different types:

* standalone
* extending built-in types

#### Pros and cons

Pros:

* The element is scoped and cannot be affected by surrounding CSS nor JS (however, it can be fully accessed on purpose with a property `shadowRoot`, e.g., `document.querySelector('.my-selector').shadowRoot`).
* Allows for good separation of concerns.
* Unlike iframed elements, it’s a part of the website, so it will fit nicely without `postMessage` tricks to get the height of the content inside.

Cons:

* Styling might be more tedious. No cascading (though, I didn’t experiment more with this).
* Creates more complex system, which might not be the best for small apps. Should be a choice for widgets intented as third-party on other websites. Could be also interesting option for large apps, to mitigate interference of various components.
* SEO department will not send us flowers.

#### More on standalone

In all my standalone examples, I used Shadow DOM which creates a scoped piece of the website, both in terms of CSS and JS (though with `{ mode: 'open' })` it can be traversed with JS from external scope.

```js
// my-custom-element.js

class MyCustomElement extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        // custom logic
    }
}

customElements.define('my-custom-element', MyCustomElement);
```

Custom logic might might include creating a complex inner HTML or just define certain behaviour.

Then, whenever we need to use it, we either just import our file, like:

```js
// other file

import 'my-custom-element.js';

// then

const myCustomElement1 = document.createElement('my-custom-element');
document.body.appendChild(myCustomElement1);
```

Or in HTML:

```html
<my-custom-element></my-custom-element>
```

##### In-project examples

* [todo-form-component.js](components/todo-form/todo-form-component.js) – a component with a form used for adding a new todo.
* [todo-list-component.js](components/todo-list/todo-list-component.js) – a component rendering a list of elements. It doesn’t use any specific markup, and just renders `<todo-item>` below. Both list and form are aware of ServiceWorker (smart vs dumb), which is something that I don’t like.
* [todo-item-component.js](components/todo-item/todo-item-component.js) – a component rendering an item from the todo list. It’s dumb, and works on data received. It also sends events instead of deciding what to do with data.

#### Extending built-in types

Described more in the routing section.

##### In-project example

* [route-link](router/route-link.js)

### Styling

The easiest option to style a custom component is to use `<style>` tag:

```js
// my-custom-element.js

const styling = `
    :host {
        border: 1px solid black;
    }
`;

class MyCustomElement extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.innerHTML = styling;
        shadowRoot.appendChild(style);

        // custom logic
    }
}
```

(`:host` allows styling the custom tag itself.)

This will work fast but with produce CSS bloat, especially with many repeating elements. Luckily, there is an interesting concept of constructable CSS stylesheets:

```js
const styling = `
    :host {
        border: 1px solid black;
    }
`;

const sheet = new CSSStyleSheet;
sheet.replace(styling).catch(error => console.error);

class MyCustomElement extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.adoptedStyleSheets = [sheet];

        // custom logic
    }
}
```

That’s fine for custom style for styling specific to a single element, but I though about more general styles (like, reset.css), and ended up with the following helper.

[dom.stylesheet-constructor.js](utils/dom.stylesheet-constructor.js)

```js
export function stylesheet({ style = '', url }) {
    const sheet = new CSSStyleSheet;

    const handleError = (error) => {
        console.warn('Error while creating a stylesheet:', url || style);
        console.error(error);
    };

    if (url) {
        fetch(url)
            .then(content => content.text())
            .then(css => sheet.replace(css))
            .catch(handleError);
    } else {
        sheet.replace(style)
            .catch(handleError);
    }

    return sheet;
}
```

[styles-container.helper.js](helpers/styles-container.helper.js):

```js
import { stylesheet } from "../utils/dom.stylesheet-constructor.js";

const fetchedStyles = new Map;
const inlineStyles = new Map;

const sheet = (base, prop, value) => {
    if (base.has(value)) return base.get(value);

    const newSheet = stylesheet({ [prop]: value });
    base.set(value, newSheet);

    return newSheet;
};

const globalFetchedStyles = sheet.bind(null, fetchedStyles, 'url');
const globalInlineStyles = sheet.bind(null, inlineStyles, 'style');

export const globalStyle = ({ style = '', url }) =>
    url
        ? globalFetchedStyles(url)
        : globalInlineStyles(style);
```

This allows to construct a stylesheet from a string or a file, in both cases caching the result so fetching and processing the style will happen only once.

The performance hasn’t been really looked into due to the size of the current app.

### Templating

Because I was now building full app in JS, I had to come up with some templating. Examples in MDN use `document.createElement`:

```js
const container = document.querySelector('.container-selector');
const ul = document.createElement('ul');
const li = document.createElement('li');
li.textContent = 'Lorem ipsum';
ul.appendChild(li);
container.appendChild(ul);
// etc., etc.
```

This will work but might be tedious and generations grown on JSX-like approaches will cringe.

So, the other way is plain ol’ `innerHTML`:

```js
const template = `
    <ul>
        <li>Lorem ipsum</li>
    </ul>
`;

const container = document.querySelector('.container-selector');
container.innerHTML = template;
```

This will work and should be fine, though, I don’t know about the performance (that would require a really big app to see). On plus side, the contents of `template` variable might come from an HTML file—like CSS above—that is fetched with, well, `fetch`. Native modules allow importing only of JavaScript files, not HTML, no CSS, not even JSON. Might come as a surprise after years with WebPack. But remember, WebPack is a lot of abstraction pretending to be less abstraction (which is fine, as long as you remember).

In the end, I went a bit over the top, and created [the following util](utils/dom.general.util.js):

```js
const stringToHtml = (string) =>
    document.createRange().createContextualFragment(string);

export function templateHandler(string) {
    const html = stringToHtml(string);

    return [html, (parent) => parent.appendChild(html)];
}
```

`stringToHtml` shall create document range with all the DOM elements, based on passed string, while `templateHandler` will return an array with two elements:

* aforementioned fragment of HTML
* a function taking a container as an argument, and adding it to the container when called

The first allows me to pick up elements deeper (as can be seen in [todo-item-component.js](components/todo-item/todo-item-component.js) where buttons and inputs are mapped to have actions attached).

According to my colleague, that would be a performance killer but I haven’t checked that. With this little nothign I have created, all worked blazingly fast.

### ServiceWorker

To move out logic from the main thread (also known as the UI thread because it’s the only one with access to DOM), I moved out data storage (equivalent of store in Redux or Vuex) to ServiceWorker. I saw in a YouTube video that this is should be a thing.

ServiceWorker registration is rather simple:

```js
navigator.serviceWorker.register('/absolute/path/sw.js);
```

There are suppose to be three methods of communication between ServiceWorker and the main thread but I managed to get only one working:

```js
async function sendMessage(message) {
    const [client] = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
    });

    client && client.postMessage(message);
}
```

This was the method requiring the least amount of code so I don’t complain.

To not have to deal with all of the codebase being aware of inner workings of ServiceWorker, I created a middle layer of [ServieWorkerBus](workers/service-worker-bus.js) which handles registration, sending messages, and promisifies communication (which is asynchronous, but with the bus, I can request something and get a message matched by its id). If the message doesn’t come from the request (has no id), it’s broadcasted to all subscribers.

### IndexedDB

`localStorage` is not accessible in workers (both ServiceWorker and WebWorkers), due to its synchronous nature, so IndexedDB was the way. I gotta admit, this proved to be a bit laborous because it’s not a simple key/string value container. It took me a couple of trials to get things right, and still a lot of those things are more copy-pasted than fully understood.

However, apart from the advantage of having one store to serve all tabs in the browser (because it can be placed in ServiceWorker), IndexedDB offers storing complex objects without JSON antics.

File: [service-worker.js](workers/service-worker.js).

### Routing

The last element I looked into was routing. Each route is described as follows,

```js
export const routes = new Map([
    ['/', {
        label: 'Home',
        title: 'Go to the homepage',
        path: '/',
        module: () => import('/router/route-home.js'),
    }],
    ['/archived-todos', {
        label: 'Archived todos',
        title: 'Go to see archived todos',
        path: '/archived-todos',
        module: () => import('/router/route-archived-todos.js'),
    }],
    ['/about', {
        label: 'About',
        title: 'Go to learn more about the app',
        path: '/about',
        module: () => import('/router/route-about.js'),
    }],
]);
```

This can be used to build a navigation:

```js
const nav = document.createElement('nav');

for (const route of routes.values()) {
    const link = document.createElement('a', { is: 'route-link' });

    link.textContent = route.label;
    link.title = route.title;
    link.href = route.path;

    nav.appendChild(link);
}
```

Or handling actual navigation:

```js
function loadModule(pathname) {
    return routes.has(pathname)
        ? routes.get(pathname).module()
        : import('/router/route-404.js');
}

class AppRouter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.loadRoute(window.location.pathname);

        window.onpopstate = (event) => {
            const path = event?.state?.path;
            if (!path) throw Error('Incomplete data on the event!');
            this.loadRoute(path);
        };
    }

    async loadRoute(pathname) {
        const { shadowRoot } = this;

        try {
            const { appendModuleTo } = await loadModule(pathname);
            shadowRoot.textContent = '';
            appendModuleTo(shadowRoot);
        } catch(error) {
            console.error(error);
        }
    }
}
```

Route is loaded with dynamic `import()` whenever needed. So we don’t load entire sections of the app until they are requested.

But how to push the new route? At first, I had something like that:

```js
window.onclick = (event) => {
    const link = event.path.find(node => node.nodeName == 'A');

    const shouldHijackClick =
        link?.host == window.location.host &&
        link.target == '' &&
        routes.has(link.pathname);

    if (shouldHijackClick) {
        event.preventDefault();

        if (link.pathname != window.location.pathname) {
            const state = {
                path: link.pathname,
            };

            window.history.pushState(state, routes.get(link.pathname).title, link.href);
            window.dispatchEvent(new PopStateEvent('popstate', { state }));
        }
    }
};
```

This reads all clicks in the app, and hijacks click if it fits route within the app. Works like charm but might be a bit aggressive. (However, subsections of the page could be safe-guarded to hijack potential route-links, something to be taken care of when content management/clients put app links in text.)

So, after some consultation, I tried extending link in [route-link.js](router/route-link.js):

```js
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
```

The usage in HTML:

```html
<a is="route-link" href="/">Homepage</a>
```

Or in JS:

```js
const link = document.createElement('a', { is: 'route-link' });

link.textContent = 'Homepage';
link.title = 'Go to homepage';
link.href = '/';
```

As per listening, while there is `popstate` event (which is triggered when I’m going back in the history to the website that was put there through JS, not an actual navigation), there is no `pushstate` event. One solution is to manually dispatch `PopStateEvent`:

```js
// from main.js

window.dispatchEvent(new PopStateEvent('popstate', { state }));
```

This will be picked-up by `window.onpopstate` in router.

## TODOs (even todo list app has them)

Given that I ever have a whim to continue, this is what I would do:

* Making components dumb and not aware of ServiceWorker (or any other source of data), and instead pass the data from the top and bubbling events instead of deciding what to do.
* Looking into checking what elements subscribed to ServiceWorkerBus are no longer needed (because they were removed from DOM). The solution currently in use is probably not working (I tried to use WeakMap as a checker but Map used).
* I had an idea to experiment with ServiceWorker returning an object of methods mapped to values created with `Symbol()` so in order to use it, one would have to ask for the interface first. Sadly, Workers don’t allow importing. Probably, it makes sense.
* Translations maybe? 🤔