import { Selection, root } from "./core/index";

export default function(selector) {
    console.log('layer:', selector);
    
    if (typeof selector === "string") {
        return new Selection([[document.querySelector(selector)]], [document.documentElement]);
    }
    return new Selection([[selector]], root);
}
