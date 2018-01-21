var guid = require("./core/guid");
var util = require("./core/util");

class Element {

    constructor(opts) {
        // super(opts);

        this.id = opts.id || guid();
        this.type = 'element';
        this.name = '';
        this.__zr = null;

        if (!opts.position) {// TODO super.attr
            this.position = [0, 0];
        }

        if (opts.rotation == null) {// TODO super.attr
            this.rotation = 0;
        }

        if (!opts.scale) {// TODO super.attr
            this.scale = [1, 1];
        }

        this.origin = this.origin || null;
    }

    addSelfToZr(zr) {
        this.__zr = zr;

        var animators = this.animators;

        if (animators) {
            animators.forEach(function(animator) {
                zr.animation.addAnimator(animator);
            })
        }

        if (this.clipPath) {
            this.clipPath.addSelfToZr(zr);
        }
    }

    beforeUpdate() {}
    afterUpdate() {}

    update() {
        this.updateTransform();
    }

    attrKV(key, value) {
        if (key === 'position' || key === 'scale' || key === 'origin') {
            if (value) {
                var target = this[key];
                if (!target) {
                    target = this[key] = [];
                }
                target[0] = value[0];
                target[1] = value[1];
            }
        } else {
            this[key] = value;
        }
    }

    attr(key, value) {
        if (typeof key === 'string') {
            this.attrKV(key, value);
        } else if (util.isObject(key)) {
            for (var name in key) {
                if (key.hasOwnProperty(name)) {
                    this.attrKV(name, key[name]);
                }
            }
        }

        this.dirty(false);

        return this;
    }

    updateTransform() {

    }
    /**
     * a c e
     * b d f
     * 0 0 1
     *
     * a,d  水平、垂直缩放
     * b,c  水平、垂直倾斜
     * e,f  水平、垂直位移
     *
     * */
    setTransform(ctx) {// TODO 上层方法
        var m = this.transform;
        var dpr = ctx.dpr || 1;

        if (m) {
            ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
        } else {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    }

    getGlobalScale() {// TODO 上层方法
        var m = this.transform;

        if (!m) {
            return [1, 1];
        }
        var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        var sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        if (m[0] < 0) {
            sx = -sx;
        }
        if (m[3] < 0) {
            sy = -sy;
        }
        return [sx, sy];
    }

    restoreTransform(ctx) {// TODO 上层方法
        var dpr = ctx.dpr || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

}

module.exports = Element;
