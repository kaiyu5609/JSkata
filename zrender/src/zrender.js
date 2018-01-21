var guid = require("./core/guid");
var zrUtil = require("./core/util");
var _export = require("./export");
var Storage = require("./Storage");
var Painter = require("./Painter");
var Animation = require("./animation/Animation");

var painterCtors = {
    canvas: Painter
};

// ZRender实例map索引
var instances = {};

/**
 * @exports zrender
 * @author kaiyu
 */
var version = '0.0.1';

/**
 * 创建zrender实例
 * @param {HTMLElement} dom 绘图容器
 * @return {module:zrender/ZRender} ZRender实例
 */
 // 不让外部直接new ZRender实例，提供全局可控同时减少全局污染和降低命名冲突的风险！
function init(dom, opts) {
    var zr = new ZRender(guid(), dom, opts);
    instances[zr.id] = zr;
    return zr;
}

function getInstance(id) {
    return instances[id];
}

function delInstance(id) {
    delete instances[id];
    return zrender;
}


/**
 * @module zrender/ZRender
 */
class ZRender {

    constructor(id, dom, opts) {
         opts = opts || {};

         this.id = id;
         this.dom = dom;

         var self = this;
         var storage = new Storage();
         var rendererType = opts.renderer || 'canvas';

         var painter = new painterCtors[rendererType](dom, storage, opts);
         this.storage = storage;
         this.painter = painter;

         this.animation = new Animation({
             stage: {
                 update: zrUtil.bind(this.flush, this)
             }
         });

         this.animation.start();


         var oldAddToStorage = storage.addToStorage;

         storage.addToStorage = function(el) {
             oldAddToStorage.call(storage, el);
             el.addSelfToZr(self);
         };

     }

     getId() {
         return this.id;
     }

     add(el) {
         this.storage.addRoot(el);
         this._needsRefresh = true;
     }

     flush() {
         if (this._needsRefresh) {
             this.refreshImmediately();
         }
     }

     refresh() {
         this._needsRefresh = true;
     }

     refreshImmediately() {
         this._needsRefresh = false;
         this.painter.refresh();
         this._needsRefresh = false;
     }

 }


(function() {
    for (var key in _export) {
        if (_export == null || !(_export.hasOwnProperty(key)) || key === 'default' || key === '__esModule') eturn;
        exports[key] = _export[key];
    }
})();

exports.version = version;
exports.init = init;
exports.getInstance = getInstance;
