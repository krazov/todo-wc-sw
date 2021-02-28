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

export const pathOf = ({ path }) => path;
