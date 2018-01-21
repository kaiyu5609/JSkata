var Displayable = require("./Displayable");
var util = require("../core/util");
var PathProxy = require("../core/PathProxy");

var pathProxyForDraw = new PathProxy(true);

class Path extends Displayable {

    constructor(opts) {
        super(opts);

        this.type = 'path';
        this.path = null;
        this.__dirtyPath = true;
    }

    brush(ctx, prevEl) {
        var style = this.style;
        var path = this.path || pathProxyForDraw;
        var hasStroke = style.hasStroke();
        var hasFill = style.hasFill();
        var fill = style.fill;
        var stroke = style.stroke;
        var hasFillGradient = hasFill && !!fill.colorStops;
        var hasStrokeGradient = hasStroke && !!stroke.colorStops;
        var hasFillPattern = hasFill && !!fill.image;
        var hasStrokePattern = hasStroke && !!stroke.image;

        style.bind(ctx, this, prevEl);
        this.setTransform(ctx);

        if (this.__dirty) {
            if (hasFillGradient) {

            }

            if (hasStrokeGradient) {

            }
        }

        if (hasFillGradient) {

        } else if (hasFillPattern) {

        }

        if (hasStrokeGradient) {

        } else if (hasStrokePattern) {

        }

        var lineDash = style.lineDash;
        var lineDashOffset = style.lineDashOffset;

        var ctxLineDash = !!ctx.setLineDash;

        var scale = this.getGlobalScale();
        path.setScale(scale[0], scale[1]);

        if (this.__dirtyPath
            || (lineDash && !ctxLineDash && hasStroke)
        ) {
            path.beginPath(ctx);

            if (lineDash && !ctxLineDash) {

            }

            this.buildPath(path, this.shape, false);

            if (this.path) {

            }
        } else {

        }

        hasFill && path.fill(ctx);

        if (lineDash && ctxLineDash) {

        }

        hasStroke && path.stroke(ctx);

        if (lineDash && ctxLineDash) {

        }

        this.restoreTransform(ctx);

        if (style.text != null) {

        }
    }

    dirty(dirtyPath) {
        if (dirtyPath == null) {
            dirtyPath = true;
        }

        if (dirtyPath) {
            this.__dirtyPath = dirtyPath;
            this._rect = null;
        }

        this.__dirty = true;
        this.__zr && this.__zr.refresh();

        if (this.__clipTarget) {
            this.__clipTarget.dirty();
        }
    }

    attrKV(key, value) {
        // FIXME
        if (key === 'shape') {
            this.setShape(value);
            this.__dirtyPath = true;
            this._rect = null;
        } else {
            super.attrKV.call(this, key, value);
        }
    }

    setShape(key, value) {
        var shape = this.shape;

        if (shape) {
            if (util.isObject(key)) {
                for (var name in key) {
                    if (key.hasOwnProperty(name)) {
                        shape[name] = key[name];
                    }
                }
            } else {
                shape[key] = value;
            }
            this.dirty(true);
        }
        return this;
    }
}

module.exports = Path;
