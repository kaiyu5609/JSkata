var d3 =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return root; });
/* harmony export (immutable) */ __webpack_exports__["a"] = Selection;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__select__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__selectAll__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__enter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__append__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__exit__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__remove__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__each__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__text__ = __webpack_require__(19);















var root = [null];

function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}

function selection() {
    return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: __WEBPACK_IMPORTED_MODULE_0__select__["a" /* default */],
    selectAll: __WEBPACK_IMPORTED_MODULE_1__selectAll__["a" /* default */],

    data: __WEBPACK_IMPORTED_MODULE_2__data__["a" /* default */],
    enter: __WEBPACK_IMPORTED_MODULE_3__enter__["b" /* default */],
    append: __WEBPACK_IMPORTED_MODULE_4__append__["a" /* default */],
    exit: __WEBPACK_IMPORTED_MODULE_5__exit__["a" /* default */],
    remove: __WEBPACK_IMPORTED_MODULE_6__remove__["a" /* default */],

    each: __WEBPACK_IMPORTED_MODULE_7__each__["a" /* default */],
    node: __WEBPACK_IMPORTED_MODULE_8__node__["a" /* default */],
    text: __WEBPACK_IMPORTED_MODULE_9__text__["a" /* default */]
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = EnterNode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sparse__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(0);



/* harmony default export */ __webpack_exports__["b"] = (function() {// this -> update
    return new __WEBPACK_IMPORTED_MODULE_1__index__["a" /* Selection */](this._enter || this._groups.map(__WEBPACK_IMPORTED_MODULE_0__sparse__["a" /* default */]), this._parents);
});

function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}

EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
        return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
        return this._parent.querySelectorAll(selector);
    }
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(update) {
    return new Array(update.length);
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return xhtml; });
var xhtml = "http://www.w3.org/1999/xhtml";

/* harmony default export */ __webpack_exports__["a"] = ({
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__selection_select__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "select", function() { return __WEBPACK_IMPORTED_MODULE_0__selection_select__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__selection_selectAll__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "selectAll", function() { return __WEBPACK_IMPORTED_MODULE_1__selection_selectAll__["a"]; });
const version = "0.0.1";
/* harmony export (immutable) */ __webpack_exports__["version"] = version;





/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_index__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (function(selector) {
    console.log('layer:', selector);
    
    if (typeof selector === "string") {
        return new __WEBPACK_IMPORTED_MODULE_0__core_index__["a" /* Selection */]([[document.querySelector(selector)]], [document.documentElement]);
    }
    return new __WEBPACK_IMPORTED_MODULE_0__core_index__["a" /* Selection */]([[selector]], __WEBPACK_IMPORTED_MODULE_0__core_index__["b" /* root */]);
});


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__selector__ = __webpack_require__(7);



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
/* harmony default export */ __webpack_exports__["a"] = (function(select) {
    if (typeof select !== "function") {
        console.log('sublayer:', select);
        select = Object(__WEBPACK_IMPORTED_MODULE_1__selector__["a" /* default */])(select);
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

    return new __WEBPACK_IMPORTED_MODULE_0__index__["a" /* Selection */](subgroups, this._parents);
});


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function none() {}

/* harmony default export */ __webpack_exports__["a"] = (function(selector) {
    return selector == null ? none : function() {
        return this.querySelector(selector);
    };
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__selectorAll__ = __webpack_require__(9);



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
/* harmony default export */ __webpack_exports__["a"] = (function(select) {
    console.log('sublayer:', select);

    if (typeof select !== "function") {
        select = Object(__WEBPACK_IMPORTED_MODULE_1__selectorAll__["a" /* default */])(select);
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

    return new __WEBPACK_IMPORTED_MODULE_0__index__["a" /* Selection */](subgroups, parents);
});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function empty() {
    return [];
}

/* harmony default export */ __webpack_exports__["a"] = (function(selector) {
    return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
    };
});


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__enter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constant__ = __webpack_require__(11);




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
            enter[i] = new __WEBPACK_IMPORTED_MODULE_1__enter__["a" /* EnterNode */](parent, data[i]);
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
            enter[i] = new __WEBPACK_IMPORTED_MODULE_1__enter__["a" /* EnterNode */](parent, d);
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
/* harmony default export */ __webpack_exports__["a"] = (function(value, key) {
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
        value = Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])(value);
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

    update = new __WEBPACK_IMPORTED_MODULE_0__index__["a" /* Selection */](update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
});


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
    return function() {
        return x;
    };
});


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__creator__ = __webpack_require__(13);


/* harmony default export */ __webpack_exports__["a"] = (function(name) {
    var create = typeof name === "function" ? name : Object(__WEBPACK_IMPORTED_MODULE_0__creator__["a" /* default */])(name);
    // this -> enterSelection
    return this.select(function() {
        // this -> EnterNode
        return this.appendChild(create.apply(this, arguments));
    });
});


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__namespace__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__namespaces__ = __webpack_require__(3);



function creatorFixed(fullname) {
    return function() {
        this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}

function creatorInherit(name) {
    return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;

        if (uri === __WEBPACK_IMPORTED_MODULE_1__namespaces__["b" /* xhtml */] && document.documentElement.namespaceURI === __WEBPACK_IMPORTED_MODULE_1__namespaces__["b" /* xhtml */]) {
            return document.createElement(name);
        }
        return document.createElementNS(uri, name);
    };
}

/* harmony default export */ __webpack_exports__["a"] = (function(name) {
    var fullname = Object(__WEBPACK_IMPORTED_MODULE_0__namespace__["a" /* default */])(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
});


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__namespaces__ = __webpack_require__(3);


/* harmony default export */ __webpack_exports__["a"] = (function(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") {
        name = name.slice(i + i);
    }
    return __WEBPACK_IMPORTED_MODULE_0__namespaces__["a" /* default */].hasOwnProperty(prefix)
        ? { space: __WEBPACK_IMPORTED_MODULE_0__namespaces__["a" /* default */][prefix], local: name }
        : name;
});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sparse__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(0);



/* harmony default export */ __webpack_exports__["a"] = (function() {
  return new __WEBPACK_IMPORTED_MODULE_1__index__["a" /* Selection */](this._exit || this._groups.map(__WEBPACK_IMPORTED_MODULE_0__sparse__["a" /* default */]), this._parents);
});


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
    return this.each(remove);
});


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(callback) {
    this._groups.forEach(function(group, i) {
        group.forEach(function(node, j) {
            if (node) callback.call(node, node.__data__, j, group);
        });
    });
    return this;
});


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function() {
    this._groups.forEach(function(group, i) {
        group.forEach(function(node, j) {
            if (node) return node;
        });
    });
    return null;
});


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function textRemove(value) {
    return function() {
        this.textContent = "";
    };
}

function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}

function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}

/* harmony default export */ __webpack_exports__["a"] = (function(value) {
    var fnText;
    if (arguments.length) {
        if (value == null) {
            fnText = textRemove;
        } else if (typeof value === "function") {
            fnText = textFunction;
        } else {
            fnText = textConstant;
        }
        return this.each(fnText(value));
    } else {
        return this.node().textContent;
    }
});


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_index__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (function(selector) {
    console.log('layer:', selector);

    if (typeof selector === "string") {
        return new __WEBPACK_IMPORTED_MODULE_0__core_index__["a" /* Selection */]([document.querySelectorAll(selector)], [document.documentElement]);
    }
    return new __WEBPACK_IMPORTED_MODULE_0__core_index__["a" /* Selection */]([selector == null ? [] : selector], __WEBPACK_IMPORTED_MODULE_0__core_index__["b" /* root */]);
});


/***/ })
/******/ ]);
//# sourceMappingURL=d3-selection.js.map