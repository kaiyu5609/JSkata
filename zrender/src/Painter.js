var util = require("./core/util");
var Layer = require("./Layer");


function parseInt10(val) {
    return parseInt(val, 10);
}

function createRoot(width, height) {
    var domRoot = document.createElement('div');

    domRoot.style.cssText = [
        'position:relative',
        'overflow:hidden',
        'width:' + width + 'px',
        'height:' + height + 'px',
        'padding:0',
        'margin:0',
        'border-width:0',
        'background-color:#eee'
    ].join(';') + ';';

    return domRoot;
}

function postProcessLayer(layer) {
    if (layer.__unusedCount == 1) {
        layer.clear();
    }
}

/**
 * 绘图容器
 */
class Painter {

    constructor(root, storage, opts) {
        this.type = 'canvas';

        var singleCanvas = !root.nodeName || root.nodeName.toUpperCase() === 'CANVAS';
        this._opts = opts = util.extend({}, opts || {});

        // this.dpr TODO

        this._singleCanvas = singleCanvas;

        this.root = root;
        var rootStyle = root.style;

        if (rootStyle) {
            rootStyle['-webkit-tap-highlight-color'] = 'transparent';
            rootStyle['-webkit-user-select'] = rootStyle['user-select'] = rootStyle['-webkit-touch-callout'] = 'none';
            root.innerHTML = '';
        }

        this.storage = storage;

        var zlevelList = this._zlevelList = [];

        var layers = this._layers = {};

        this._layerConfig = {};

        if (!singleCanvas) {
            this._width = this._getSize(0);
            this._height = this._getSize(1);
            var domRoot = this._domRoot = createRoot(this._width, this._height);
            root.appendChild(domRoot);
        } else {

        }

        this._progressiveLayers = [];

        this._hoverlayer;
        this._hoverElements = [];
    }

    _getSize(whIdx) {
        var opts = this._opts;
        var wh = ['width', 'height'][whIdx];
        var cwh = ['clientWidth', 'clientHeight'][whIdx];
        var plt = ['paddingLeft', 'paddingTop'][whIdx];
        var prb = ['paddingRight', 'paddingBottom'][whIdx];

        if (opts[wh] != null && opts[wh] !== 'auto') {
            return parseFloat(opts[wh]);
        }

        var root = this.root;

        var stl = document.defaultView.getComputedStyle(root);
        return (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh])) - (parseInt10(stl[plt]) || 0) - (parseInt10(stl[prb]) || 0) | 0;
    }

    refresh(paintAll) {
        var list = this.storage.getDisplayList(true);
        var zlevelList = this._zlevelList;
        var self = this;

        this._paintList(list, paintAll);

        zlevelList.forEach(function(z, i) {
            var layer = self._layers[z];

            if (!layer.__builtin__ && layer.refresh) {
                layer.refresh();
            }
        });

        this.refreshHover();

        if (this._progressiveLayers.length) {
            this._startProgressive();
        }

        return this;
    }

    refreshHover() {
        var hoverElements = this._hoverElements;
        var len = hoverElements.length;
        var hoverLayer = this._hoverlayer;
        hoverLayer && hoverLayer.clear();

        if (!len) {
            return;
        }

        timsort(hoverElements, this.storage.displayableSortFunc);

        if (!hoverLayer) {
            hoverLayer = this._hoverlayer = this.gerLayer(1e5);
        }

        var scope = {};
        hoverLayer.ctx.save();

        for (var i = 0; i < len;) {
            var el = hoverElements[i];
            var originalEl = el.__from;

            if (!(originalEl && originalEl.__zr)) {
                hoverElements.splice(i, 1);
                originalEl.__hoverMir = null;
                len--;
                continue;
            }

            i++;

            if (!originalEl.invisible) {
                el.transform = originalEl.transform;
                el.invTransform = originalEl.invTransform;
                el.__clipPaths = originalEl.__clipPaths;

                this._doPaintEl(el, hoverLayer, true, scope);
            }
        }

        hoverLayer.ctx.restore();
    }

    _paintList(list, paintAll) {
        if (paintAll == null) {
            paintAll = false;
        }

        this._updateLayerStatus(list);

        this._doPaintList(list, paintAll);

        this.eachBuiltinlayer(postProcessLayer);

    }

    _doPaintList(list, paintAll) {
        var currentLayer,
            currentZLevel,
            ctx,
            scope,
            progressiveLayerIdx = 0,
            currentProgressiveLayer;

        var width = this._width,
            height = this._height,
            layerProgress,
            frame = this._progress || 0;// TODO

        var self = this;

        list.forEach(function(el) {
            var elZLevel = 0;// TODO
            var elFrame = el.__frame || -1;
            if (currentZLevel !== elZLevel) {
                if (ctx) {
                    ctx.restore();
                }

                scope = {};

                currentZLevel = elZLevel;
                currentLayer = self.getLayer(currentZLevel);

                if (!currentLayer.__builtin__) {

                }

                ctx = currentLayer.ctx;
                ctx.save();

                currentLayer.__unusedCount = 0;

                if (currentLayer.__dirty || paintAll) {
                    currentLayer.clear();
                }

                // if (!(currentLayer.__dirty || paintAll)) {
                //     continue;
                // }

                if (elFrame >= 0) {

                } else {
                    self._doPaintEl(el, currentLayer, paintAll, scope);
                }

                el.__dirty = false;
            }
        });


        ctx && ctx.restore();

        this._furtherProgressive = false;

    }

    _doPaintEl(el, currentLayer, forcePaint, scope) {
        var ctx = currentLayer.ctx;
        var m = el.transform;

        if (
            (currentLayer.__dirty || forcePaint) && // Ignore invisible element
            !el.invisible // Ignore transparent element
            && el.style.opacity !== 0 // Ignore scale 0 element, in some environment like node-canvas
            // Draw a scale 0 element can cause all following draw wrong
            // And setTransform with scale 0 will cause set back transform failed.
            && !(m && !m[0] && !m[3]) // Ignore culled element
            && !(el.culling)
        ) {// TODO
            var clipPaths = el.__clipPaths;

            if (scope.prevClipLayer !== currentLayer || 1) {// TODO
                if (scope.prevElClipPaths) {

                }

                if (clipPaths) {

                }
            }
        }
        el.beforeBrush && el.beforeBrush(ctx);

        el.brush(ctx, scope.prevEl || null);
        scope.prevEl = el;

        el.afterBrush && el.afterBrush(ctx);
    }
    /**
     * 获取 zlevel 所在层，如果不存在则会创建一个新的层
     * @param {number} zlevel
     * @return {module:zrender/Layer}
     */
    getLayer(zlevel) {
        if (this._singleCanvas) {
            return this._layers[0];
        }

        var layer = this._layers[zlevel];

        if (!layer) {
            layer = new Layer('zr_' + zlevel, this, this.dpr);
            layer.__builtin__ = true;

            if (this._layerConfig[zlevel]) {
                util.merge(layer, this._layerConfig[zlevel], true);
            }

            this.insertLayer(zlevel, layer);

            layer.initContext();
        }

        return layer;
    }

    insertLayer(zlevel, layer) {
        var layersMap = this._layers;
        var zlevelList = this._zlevelList;
        var len = zlevelList.length;
        var prevLayer = null;
        var i = -1;
        var domRoot = this._domRoot;

        if (layersMap[zlevel]) {
            return;
        }

        layersMap[zlevel] = layer;

        if (!layer.virtual) {
            if (prevLayer) {// TODO

            } else {
                if (domRoot.firstChild) {
                    domRoot.insertBefore(layer.dom, domRoot.firstChild);
                } else {
                    domRoot.appendChild(layer.dom);
                }
            }
        }
    }

    _updateLayerStatus(list) {
        list.forEach(function(el, i) {


            // TODO
            el.__frame = -1;
        });
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    eachBuiltinlayer(cb, context) {
        var zlevelList = this._zlevelList;
        var layer;

        zlevelList.forEach(function(z, i) {
            layer = this._layers[z];
            if (layer.__builtin__) {
                cb.call(context, layer, z);
            }
        });
    }


}

module.exports = Painter;
