export const compareTodos = (a, b) =>
    a.isDone && !b.isDone
        ? 1
        : !a.isDone && b.isDone
            ? -1
            : a.id - b.id;
