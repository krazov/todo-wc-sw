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
