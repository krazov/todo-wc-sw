export function stylesheet(style = '') {
    const sheet = new CSSStyleSheet;

    try {
        sheet.replace(style);
    } catch (error) {
        console.warn('Error while creating a stylesheet:', style);
        console.error(error);

    }

    return sheet;
}
