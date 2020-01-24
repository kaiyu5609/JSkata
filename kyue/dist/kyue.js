
/**
 * Kyue v1.0.0
 * (c) 2020 kaiyu5609
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.kyue = factory());
}(this, function () { 'use strict';

    // 这些助手由于其明确性和功能内联性，因此可以在JS引擎中生成更好的VM代码。
    function isUndef(v) {
        return v === undefined || v === null;
    }
    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isTrue(v) {
        return v === true;
    }
    /**
     * 检查值是否为基础类型的
     * @param value
     */
    function isPrimitive(value) {
        return (typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'symbol' ||
            typeof value === 'boolean');
    }
    /**
     * 快速对象检查-当我们知道值是JSON兼容类型时，主要用于从原始值告诉对象
     * @param obj
     */
    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }
    function noop(a, b, c) { }
    //# sourceMappingURL=util.js.map

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
    //# sourceMappingURL=debug.js.map

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
    //# sourceMappingURL=index.js.map

    var activeInstance = null;
    function lifecycleMixin(Kyue) {
        Kyue.prototype._update = function (vnode, hydrating) {
            var vm = this;
            var prevVnode = vm._vnode;
            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode;
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
            }
            else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance;
        };
    }
    function initLifecycle(vm) {
        var options = vm.$options;
        var parent = options.parent;
        if (parent) {
            parent.$children.push(vm);
        }
        vm.$parent = parent;
        vm.$root = parent ? parent.$root : vm;
        vm.$children = [];
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
    //# sourceMappingURL=lifecycle.js.map

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
    //# sourceMappingURL=state.js.map

    var VNode = /** @class */ (function () {
        function VNode(tag, data, children, text, elm, context, componentOptions) {
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
            this.context = context;
            this.componentOptions = componentOptions;
        }
        return VNode;
    }());
    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val));
    }

    var componentVNodeHooks = {
        init: function (vnode, hydrating) {
            var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        },
        prepatch: function (oldVnode, vnode) {
        },
        insert: function (vnode) {
        },
        destroy: function (vnode) {
        }
    };
    var hooksToMerge = Object.keys(componentVNodeHooks);
    function createComponent(Ctor, data, context, children, tag) {
        if (isUndef(Ctor)) {
            return;
        }
        var baseCtor = context.$options._base; // Kyue
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
        }
        if (typeof Ctor !== 'function') {
            {
                warn("Invalid Component definition: " + String(Ctor), context);
            }
            return;
        }
        data = data || {};
        var propsData = {};
        var listeners = {};
        intallComponentHooks(data);
        var name = Ctor.options.name || tag || 'app'; // TODO
        var vnode = new VNode("kyue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children });
        return vnode;
    }
    function createComponentInstanceForVnode(vnode, parent // 当前vm的实例
    ) {
        var options = {
            _isComponent: true,
            _parentVnode: vnode,
            parent: parent
        };
        return new vnode.componentOptions.Ctor(options);
    }
    function intallComponentHooks(data) {
        var hooks = data.hook || (data.hook = {});
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i];
            var existing = hooks[key];
            var toMerge = componentVNodeHooks[key];
            if (existing !== toMerge && !(existing && existing._merged)) {
                hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
            }
        }
    }
    function mergeHook(f1, f2) {
        var merged = function (a, b) {
            f1(a, b);
            f2(a, b);
        };
        merged._merged = true;
        return merged;
    }

    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;
    /**
     * 包装函数，以提供更灵活的界面
     * 不会被流程大吼大叫
     * @param context
     * @param tag
     * @param data
     * @param children
     */
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
        }
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE;
        }
        return _createElement(context, tag, data, children, normalizationType);
    }
    function _createElement(context, tag, data, children, normalizationType) {
        if (normalizationType === ALWAYS_NORMALIZE) {
            // 将children转化成Array<VNode>，如：文本节点也会转化成[VNode]
            children = normalizeChildren(children);
        }
        else if (normalizationType === SIMPLE_NORMALIZE) {
            // 将二维Array<VNode>拍成一维Array<VNode>
            children = simpleNormalizeChildren(children);
        }
        var vnode;
        if (typeof tag === 'string') {
            // 普通节点
            vnode = new VNode(tag, data, children);
        }
        else {
            // 组件
            vnode = createComponent(tag, data, context, children);
        }
        return vnode;
    }
    /**
     * TODO
     * @param children
     */
    function simpleNormalizeChildren(children) {
        return children;
    }
    /**
     * TODO
     */
    function normalizeChildren(children) {
        return isPrimitive(children)
            ? [createTextVNode(children)]
            : Array.isArray(children)
                ? children
                : undefined;
    }

    function renderMixin(Kyue) {
        Kyue.prototype._render = function () {
            var vm = this;
            var _a = vm.$options, render = _a.render, _parentVnode = _a._parentVnode;
            // 占位符vnode，初始化 _parentVnode 为 undefined
            vm.$vnode = _parentVnode;
            console.log('_render:', 'vm.$vnode = _parentVnodes (' + (_parentVnode && _parentVnode.tag) + ')');
            var vnode;
            try {
                vnode = render.call(vm, vm.$createElement);
            }
            catch (e) {
            }
            finally {
            }
            // 占位符vnode是渲染vnode的父级
            vnode.parent = _parentVnode;
            return vnode;
        };
    }
    function initRender(vm) {
        vm._vnode = null;
        var options = vm.$options;
        var parentVnode = vm.$vnode = options._parentVnode;
        vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
    }
    //# sourceMappingURL=render.js.map

    var uid = 0;
    function initMixin(Kyue) {
        Kyue.prototype._init = function (options) {
            console.log('_init:', 'vm\'s init');
            var vm = this;
            vm._uid = uid++;
            vm._isVue = true;
            if (options && options._isComponent) {
                // 优化内部组件实例化，因为动态选项合并非常慢，并且没有内部组件选项需要特殊处理。
                initInternalComponent(vm, options);
            }
            else {
                vm.$options = options;
            }
            /**TODO**/
            vm.$options._base = Kyue;
            /**TODO**/
            vm._self = vm;
            /**
             * 1、noop
             */
            initLifecycle(vm);
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
    function initInternalComponent(vm, options) {
        var opts = vm.$options = Object.create(vm.constructor.options);
        var parentVnode = options._parentVnode;
        opts.parent = options.parent;
        opts._parentVnode = parentVnode;
        var vnodeComponentOptions = parentVnode.componentOptions;
        opts.propsData = vnodeComponentOptions.propsData;
        opts._parentListeners = vnodeComponentOptions.listeners;
        opts._renderChildren = vnodeComponentOptions.children;
        opts._componentTag = vnodeComponentOptions.tag;
        if (options.render) {
            opts.render = options.render;
        }
    }
    //# sourceMappingURL=init.js.map

    function emptyNodeAt(elm) {
        return new VNode(elm.tagName.toLocaleLowerCase(), {}, [], undefined, elm);
    }
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {
        console.log('createElm:', vnode);
        /****组件的创建****/
        if (createComponent$1(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }
        /****普通节点的创建****/
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if (isDef(tag)) {
            vnode.elm = vnode.ns
                ? document.createElementNS(vnode.ns, tag)
                : document.createElement(tag, vnode);
            createChildren(vnode, children, insertedVnodeQueue);
            if (data) {
                setData(vnode, data);
            }
            insert(parentElm, vnode.elm, refElm);
        }
        else if (isTrue(vnode.isComment)) ;
        else {
            // 文本节点
            vnode.elm = document.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null);
            }
        }
        else if (isPrimitive(vnode.text)) {
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
        if (isUndef(oldVnode)) {
            createElm(vnode, insertedVnodeQueue);
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
    function createComponent$1(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data;
        if (isDef(i)) {
            if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false); /* hydrating */
            }
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode);
                insert(parentElm, vnode.elm, refElm);
                return true;
            }
        }
    }
    function initComponent(vnode, insertedVnodeQueue) {
        vnode.elm = vnode.componentInstance.$el;
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
    /**
     * 全局API
     * 书写位置TODO
     */
    Kyue.options = Object.create(null);
    Kyue.options._base = Kyue;
    Kyue.cid = 0;
    var cid = 1;
    Kyue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var SuperId = Super.cid;
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId];
        }
        var name = extendOptions.name || Super.options.name;
        var Sub = function KyueComponent(options) {
            this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = extendOptions; // TODO
        Sub.super = Super;
        Sub.extend = Super.extend;
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub;
    };
    //# sourceMappingURL=index.js.map

    //# sourceMappingURL=index.js.map

    return Kyue;

}));
//# sourceMappingURL=kyue.js.map
