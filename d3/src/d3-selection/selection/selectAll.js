import { Selection, root } from "./core/index";

export default function(selector) {
    console.log('layer:', selector);

    if (typeof selector === "string") {
        return new Selection([document.querySelectorAll(selector)], [document.documentElement]);
    }
    return new Selection([selector == null ? [] : selector], root);
}
