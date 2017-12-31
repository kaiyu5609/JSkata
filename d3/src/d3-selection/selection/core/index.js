import core_select from "./select";
import core_selectAll from "./selectAll";

import core_data from "./data";
import core_enter from "./enter";
import core_append from "./append";
import core_exit from "./exit";
import core_remove from "./remove";

import core_each from "./each";
import core_node from "./node";
import core_text from "./text";



export var root = [null];

export function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}

function selection() {
    return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: core_select,
    selectAll: core_selectAll,

    data: core_data,
    enter: core_enter,
    append: core_append,
    exit: core_exit,
    remove: core_remove,

    each: core_each,
    node: core_node,
    text: core_text
};
