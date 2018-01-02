import { Selection } from "./index";
import { EnterNode } from "./enter";
import constant from "../constant";

var keyPrefix = "$";

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

/**
 * @method bindIndex
 * @param {Object} parent div.container
 * @param {NodeList} group [div.row, div.row]
 * @param {Array} enter []
 * @param {Array} update [] -> [div.row]
 * @param {Array} exit []
 * @param {Array} data [1, 2, 3, 4, 5]
 */
function bindKey(parent, group, enter, update, exit, data, key) {
    var nodeByKeyValue = {},
        keyValues = [],
        keyValue;

    // 为每个已存在的节点分配对应的可以，缓存起来，确保不重复
    // 如果多个节点有相同的key，那个重复的节点会被放进exit中
    group.forEach(function(node, i) {
        if (node) {
            keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
            if (keyValue in nodeByKeyValue) {// 重复的节点放进exit中
                exit[i] = node;
            } else {
                nodeByKeyValue[keyValue] = node;
            }
        }
    });

    // 通过数据生成的key，找出是否有某个节点跟这个数据是关联的
    // 如果有一个节点关联了这个key，则将该数据挂到update中
    // 如果没有或者这是一个重复的key，则将该数据挂到enter中
    data.forEach(function(d, i) {
        keyValue = keyPrefix + key.call(parent, d, i, data);
        var node = nodeByKeyValue[keyValue];
        if (node) {
            update[i] = node;
            node.__data__ = d;
            nodeByKeyValue[keyValue] = null;
        } else {
            enter[i] = new EnterNode(parent, d);
        }
    });

    // 将没有进行数据绑定的多余节点 放进exit中
    group.forEach(function(node, i) {
        if (node && (nodeByKeyValue[keyValues[i]] === node)) {
            exit[i] = node;
        }
    });
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
    if (!value) {
        let data = [], i = -1;
        this.each(function(d) {
            data[++i] = d;
        });
        return data;
    }
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
