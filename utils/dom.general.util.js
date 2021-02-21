const stringToHtml = (string) =>
    document.createRange().createContextualFragment(string);

export function templateHandler(string) {
    const html = stringToHtml(string);

    return [html, (parent) => parent.appendChild(html)];
}