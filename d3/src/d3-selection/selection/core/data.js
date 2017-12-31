import { Selection } from "./index";
import { EnterNode } from "./enter";
import constant from "../constant";

/**
 * @method bindIndex
 * @param {Object} parent div.container
 * @param {NodeList} group [div.row, div.row]
 * @param {Array} enter []
 * @param {Array} update [] -> [div.row]
 * @param {Array} exit []
 * @param {Array} data [1, 2, 3, 4, 5]
 */
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;

    // 将 数据可绑定到 已存在的子节点 放进update中
    // 将 数据没有可绑定 的那些将要生成的 子节点 放进enter中
    // 将 未能绑定的数据 放进enter中
    for (; i < dataLength; i++) {
        if (node = group[i]) {// 子节点已存在
            node.__data__ = data[i];
            update[i] = node;
        } else {// 子节点未存在
            enter[i] = new EnterNode(parent, data[i]);
        }
    }

    // 将多余的节点 放进exit中
    for (; i < groupLength; i++) {
        if (node = group[i]) {
            exit[i] = node;
        }
    }
}

function bindKey() {

}


/**
 * <div class="container">
 *  <div class="row"></div>
 *  <div class="row"></div>
 * </div>
 * groups    = [[div.row, div.row]]
 * group     = [div.row, div.row]
 * parents   = [div.container]
 * parent    = div.container
 *
 * @method data
 * @param {Array}
 * @param {Function}
 * @return {Object} selection
 */
export default function(value, key) {
    var bind = key ? bindKey : bindIndex,
        groups = this._groups,
        parents = this._parents;

    var update = [],
        enter = [],
        exit = [];

    if (typeof value !== "function") {
        value = constant(value);
    }

    groups.forEach(function(group, i) {
        var parent = parents[i],
            data = value.call(parent, parent && parent.__data__, i, parents),
            dataLength = data.length,
            enterGroup = enter[i] = [],
            updateGroup = update[i] = [],
            exitGroup = exit[i] = [];

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        var k = 0, prev, next;
        data.forEach(function(d, j) {
            if (prev = enterGroup[j]) {
                if (j >= k) {
                    k = j + 1;
                }
                while (!(next = updateGroup[k]) && ++k < dataLength);
                prev._next = next || null;
            }
        });
    });

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
