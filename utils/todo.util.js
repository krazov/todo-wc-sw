export const compareTodos = (a, b) =>
    a.isDone && !b.isDone
        ? 1
        : !a.isDone && b.isDone
            ? -1
            : a.id - b.id;

export const isArchivedTodo = ({ isArchived = false }) => isArchived;
export const isActiveTodo = (todo) => !isArchivedTodo(todo);

export const isDoneTodo = ({ isDone = false }) => isDone;
export const isUnfinishedTodo = (todo) => !isDoneTodo(todo);
