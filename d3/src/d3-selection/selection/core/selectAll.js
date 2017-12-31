import { Selection } from "./index";
import selectorAll from "../selectorAll";

/**
 * <div class="container">
 *  <div class="row"></div>
 *  <div class="row"></div>
 * </div>
 * groups    = [[div.container]]
 * group     = [div.container]
 * node      = div.container
 * subgroups = [[div.row, div.row]] Array NodeList
 * parents   = [div.container]
 *
 * @method select
 * @param {String|Object|Function} 'selector'|selector|function
 * @return {Object} selection
 */
export default function(select) {
    console.log('sublayer:', select);

    if (typeof select !== "function") {
        select = selectorAll(select);
    }

    var subgroups = [], parents = [];

    this._groups.forEach(function(group, i) {
        group.forEach(function(node, j) {
            if (node) {
                subgroups.push(select.call(node, node.__data__, j, group));
                parents.push(node);
            }
        });
    });

    return new Selection(subgroups, parents);
}
