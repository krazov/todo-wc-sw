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
