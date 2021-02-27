import { stylesheet } from "../utils/dom.stylesheet-constructor.js";

const fetchedStyles = new Map;
const inlineStyles = new Map;

const sheet = (base, prop, value) => {
    if (base.has(value)) return base.get(value);

    const newSheet = stylesheet({ [prop]: value });
    base.set(value, newSheet);

    return newSheet;
};

export const globalStyle = ({ style = '', url }) => url
    ? sheet(fetchedStyles, 'url', url)
    : sheet(inlineStyles, 'style', style);
