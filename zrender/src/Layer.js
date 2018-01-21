var util = require("./core/util");

function returnFalse() {
    return false;
}

function createDom(id, painter, dpr) {
    var newDom = util.createCanvas();
    var width = painter.getWidth();
    var height = painter.getHeight();
    var newDomStyle = newDom.style; // 没append呢，请原谅我这样写，清晰~

    newDomStyle.position = 'absolute';
    newDomStyle.left = 0;
    newDomStyle.top = 0;
    newDomStyle.width = width + 'px';
    newDomStyle.height = height + 'px';
    newDom.width = width * dpr;
    newDom.height = height * dpr; // id不作为索引用，避免可能造成的重名，定义为私有属性

    newDom.setAttribute('data-zr-dom-id', id);
    return newDom;
}

class Layer {
    constructor(id, painter, dpr) {
        var dom;
        dpr = dpr || 2;// TODO

        if (typeof id === 'string') {
            dom = createDom(id, painter, dpr);
        } else if (util.isObject(id)) {
            dom = id;
            id = dom.id;
        }

        this.id = id;
        this.dom = dom;
        var domStyle = dom.style;

        if (domStyle) {
            dom.onselectstart = returnFalse;

            domStyle['-webkit-user-select'] = 'none';
            domStyle['user-select'] = 'none';
            domStyle['-webkit-touch-callout'] = 'none';
            domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
            domStyle['padding'] = 0;
            domStyle['margin'] = 0;
            domStyle['border-width'] = 0;
        }

        this.domBack = null;
        this.ctxBack = null;
        this.painter = painter;
        this.config = null; // Configs

        this.clearColor = 0;

        this.motionBlur = false;

        this.lastFrameAlpha = 0.7;

        this.dpr = dpr;

        this.__dirty = true;
        this.elCount = 0;
    }

    initContext() {
        this.ctx = this.dom.getContext('2d');
        this.ctx.__currentValues = {};
        this.ctx.dpr = this.dpr;
    }

    clear(clearAll) {
        var dom = this.dom;
        var ctx = this.ctx;
        var width = dom.width;
        var height = dom.height;

        var clearColor = this.clearColor;
        var haveMotionBLur = this.motionBlur && !clearAll;
        var lastFrameAlpha = this.lastFrameAlpha;
        var dpr = this.dpr;


        ctx.clearRect(0, 0, width, height);
    }
}

module.exports = Layer;
