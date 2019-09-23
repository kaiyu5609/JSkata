
/**
 * Kyue v1.0.0
 * (c) 2019 kaiyu5609
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.kyue = factory());
}(this, function () { 'use strict';

    function noop(a, b, c) { }

    var warn = noop;
    {
        var hasConsole_1 = typeof console !== 'undefined';
        warn = function (msg, vm) {
            var trace = ''; // TODO
            // TODO
            if (hasConsole_1) {
                console.error("[Kyue warn]: " + msg + trace);
            }
        };
    }

    /**
     * 选择元素
     * @param el 元素id、class、DOM
     */
    function query(el) {
        if (typeof el === 'string') {
            var selected = document.querySelector(el);
            if (!selected) {
                 console.log('Cannot find element: ' + el);
                return document.createElement('div');
            }
            return selected;
        }
        else {
            return el;
        }
    }

    function lifecycleMixin(Kyue) {
        Kyue.prototype._update = function (vnode, hydrating) {
            var vm = this;
            var prevVnode = vm._vnode;
            vm._vnode = vnode;
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
            }
            else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
        };
    }
    function mountComponent(vm, el, hydrating) {
        vm.$el = el;
        var updateComponent = function () {
            vm._update(vm._render(), hydrating);
        };
        updateComponent();
        // km上其实没有该方法 TODO
        vm.updateComponent = updateComponent;
        return vm;
    }

    var sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };
    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter() {
            return this[sourceKey][key];
        };
        sharedPropertyDefinition.set = function proxySetter(val) {
            this[sourceKey][key] = val;
        };
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }
    function initState(vm) {
        var opts = vm.$options;
        if (opts.data) {
            initData(vm);
        }
    }
    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
        var keys = Object.keys(data);
        var i = keys.length;
        while (i--) {
            var key = keys[i];
            proxy(vm, "_data", key);
        }
        // TODO observe data
        // ...
    }
    function getData(data, vm) {
        try {
            return data.call(vm, vm);
        }
        catch (e) {
            // TODO
            return {};
        }
        finally {
        }
    }

    /**
     * vnode
     * {
     *     tag: 'div',// 元素标签名称
     *     data: {
     *         attr: { id: 'app' }// 元素的数据
     *     },
     *     children: []// 子元素
     * }
     */
    var VNode = /** @class */ (function () {
        function VNode(tag, data, children, text, elm) {
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
        }
        return VNode;
    }());

    function createElement(context, tag, data, children) {
        if (Array.isArray(data)) {
            children = data;
            data = undefined;
        }
        return _createElement(context, tag, data, children);
    }
    function _createElement(context, tag, data, children) {
        var vnode;
        vnode = new VNode(tag, data, children);
        return vnode;
    }

    function renderMixin(Kyue) {
        Kyue.prototype._render = function () {
            var vm = this;
            var _a = vm.$options, render = _a.render, _parentVnode = _a._parentVnode;
            // 初始化 _parentVnode 为 undefined
            vm.$vnode = _parentVnode;
            console.log('_render:', 'vm.$vnode = _parentVnodes (' + _parentVnode + ')');
            var vnode;
            try {
                vnode = render.call(vm, vm.$createElement);
            }
            catch (e) {
            }
            finally {
            }
            vnode.parent = _parentVnode;
            return vnode;
        };
    }
    function initRender(vm) {
        vm._vnode = null;
        var options = vm.$options;
        var parentVnode = vm.$vnode = options._parentVnode;
        vm.$createElement = function (a, b, c) { return createElement(vm, a, b, c); };
    }

    var uid = 0;
    function initMixin(Kyue) {
        Kyue.prototype._init = function (options) {
            console.log('_init:', 'vm\'s init');
            var vm = this;
            vm._uid = uid++;
            vm._self = vm;
            vm.$options = options;
            /**
             * 1、给实例添加options.data中数据的代理
             */
            initState(vm);
            /**
             * 1、给实例添加$createElement方法
             */
            initRender(vm);
            if (vm.$options.el) {
                console.log('_init:', 'vm.$mount');
                // 返回的是 vm
                vm.$mount(vm.$options.el);
            }
        };
    }

    function emptyNodeAt(elm) {
        return new VNode(elm.tagName.toLocaleLowerCase(), {}, [], undefined, elm);
    }
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {
        console.log('createElm:', vnode);
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        vnode.elm = vnode.ns
            ? document.createElementNS(vnode.ns, tag)
            : document.createElement(tag, vnode);
        createChildren(vnode, children);
        if (data) {
            setData(vnode, data);
        }
        insert(parentElm, vnode.elm, refElm);
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) ;
        else {
            // TODO 需要 normalize children
            var text = String(vnode.text || vnode.children);
            vnode.elm.appendChild(document.createTextNode(text));
        }
    }
    function setData(vnode, data) {
        for (var key in data) {
            if (key == 'attrs') {
                for (var attr in data[key]) {
                    vnode.elm.setAttribute(attr, data[key][attr]);
                }
            }
        }
    }
    function insert(parent, elm, ref) {
        if (parent) {
            if (ref) {
                if (ref.parentNode === parent) {
                    parent.insertBefore(elm, ref);
                }
            }
            else {
                parent.appendChild(elm);
            }
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch) {
                if (ch.tag) {
                    // TODO
                    removeNode(ch.elm);
                }
                else { // Text node
                    removeNode(ch.elm);
                }
            }
        }
    }
    function removeNode(el) {
        var parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    }
    function patch(oldVnode, vnode, hydrating, removeOnyl) {
        var insertedVnodeQueue = [];
        // 组件的 mount，生成一个新的root元素
        if (typeof oldVnode === 'undefined') {
            createElm(vnode);
        }
        else {
            var isRealElement = oldVnode.nodeType;
            // TODO sameVnode(oldVnode, vnode)
            if (!isRealElement) {
                console.log('patch.update:', 'sameVnode');
            }
            else {
                if (isRealElement) {
                    oldVnode = emptyNodeAt(oldVnode);
                }
                var oldElm = oldVnode.elm;
                var parentElm = oldElm.parentNode;
                createElm(vnode, insertedVnodeQueue, oldElm._leaveCb ? null : parentElm, oldElm.nextSibling);
                if (parentElm) {
                    removeVnodes([oldVnode], 0, 0);
                }
            }
        }
        return vnode.elm;
    }

    // @ts-nocheck
    function Kyue(options) {
        if ( !(this instanceof Kyue)) {
            warn('Kyue is a constructor and should be called with the `new` keyword');
        }
        this._init(options);
    }
    Kyue.prototype.$mount = function (el, hydrating) {
        el = el && query(el);
        return mountComponent(this, el, hydrating);
    };
    Kyue.prototype.__patch__ = patch;
    /**
     * 1、给实例添加_init方法
     * 2、组件调用 $mount 方法进行挂载
     */
    initMixin(Kyue);
    /**
     * 1、给实例添加_update方法
     *
     */
    lifecycleMixin(Kyue);
    /**
     * 1、给实例添加_render方法
     *  该方法生成虚拟DOM：vnode
     */
    renderMixin(Kyue);

    return Kyue;

}));
//# sourceMappingURL=kyue.js.map
