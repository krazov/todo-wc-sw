import { LIST_UPDATED } from '../constants/db.js';

export const listUpdated = (type, payload) => new CustomEvent('serviceWorkerUpdate', {
    detail: { type, payload },
});
