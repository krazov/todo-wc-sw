export const routes = new Map([
    ['/', {
        label: 'Home',
        title: 'Go to the homepage',
        path: '/',
        module: () => import('/routes/route-home.js'),
    }],
    ['/archived-todos', {
        label: 'Archived todos',
        title: 'Go to see archived todos',
        path: '/archived-todos',
    }],
    ['/about', {
        label: 'About',
        title: 'Go to learn more about the app',
        path: '/about',
    }],
]);

export const pathOf = ({ path }) => path;
