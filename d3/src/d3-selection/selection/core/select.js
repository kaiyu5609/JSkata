import { Selection } from "./index";
import selector from "../selector";

/**
 * <div class="container">
 *  <div class="row"></div>
 * </div>
 * groups    = [[div.container]]
 * group     = [div.container]
 * node      = div.container
 * subnode   = div.row
 * subgroup  = [div.row]
 * subgroups = [[div.row]]
 * parents   = [html]
 *
 * @method select
 * @param {String|Object|Function} 'selector'|selector|function
 * @return {Object} selection
 */
export default function(select) {
    if (typeof select !== "function") {
        console.log('sublayer:', select);
        select = selector(select);
    }

    var subgroups = this._groups.map(function(group, i) {
        var subnode;

        return group.map(function(node, j) {
            if (node && (subnode = select.call(node, node.__data__, j, group))) {
                if ("__data__" in node) {
                    subnode.__data__ = node.__data__;
                }
                return subnode;
            }
        });
    });

    return new Selection(subgroups, this._parents);
}
