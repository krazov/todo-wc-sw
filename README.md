# Todo List Water Closet Star Wars

I haven’t done a todo list in a while. This time, there’s gonna be use WebComponents (`-wc-`) and ServiceWorker (`-sw-`) which additionally utilises IndexedDB. Then, a colleague told me about constructable style sheets, and I threw them into mix.

## Running the thing

1. Clone the repo.
2. Run static server in the root folder.

## Technologies used

### WebComponents

A minimum building unit for the project are now components, each encapsulating markup and accompanying logic. At the moment, some components are smart but the long-game is to have them dumb and just bubbling events which can be picked up by components higher in the hierarchy (initially, the `main` function is planned for that).

### ServiceWorker

To make it lighter for the main thread, also known as UI thread, all IndexedDB operations have been moved to ServiceWorker.

### IndexedDB

No more synchronous localStorage. Which was the condition to go full Worker.

### Constructable style sheets

To avoid CSS bloat when `<style></style>` tag is added in every component (lists, anyone?), stylesheets are calculated and shared between various components.

CSS is taken from accompanying CSS files.
