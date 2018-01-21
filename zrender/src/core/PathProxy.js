var dpr = 2;

var CMD = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  // Rect
  R: 7
};

var min = [];
var max = [];
var min2 = [];
var max2 = [];
var mathMin = Math.min;
var mathMax = Math.max;
var mathCos = Math.cos;
var mathSin = Math.sin;
var mathSqrt = Math.sqrt;
var mathAbs = Math.abs;
var hasTypedArray = typeof Float32Array != 'undefined';

class PathProxy {
    constructor(notSaveData) {
        this._saveData = !(notSaveData || false);

        if (this._saveData) {
            this.data = [];
        }

        this._ctx = null;
    }

    setScale(sx, sy) {
        this._ux = mathAbs(1 / dpr / sx) || 0;
        this._uy = mathAbs(1 / dpr / sy) || 0;
    }

    getContext() {
        return this._ctx;
    }

    beginPath(ctx) {
        this._ctx = ctx;
        ctx && ctx.beginPath();
        ctx && (this.dpr = ctx.dpr);

        if (this._saveData) {
            this._len = 0;
        }

        if (this._lineDash) {
            this._lineDash = null;
            this._dashOffset = 0;
        }

        return this;
    }

    fill(ctx) {
        ctx && ctx.fill();
        this.toStatic();
    }

    stroke(ctx) {
        ctx && ctx.stroke();
        this.toStatic();
    }

    toStatic() {
        var data = this.data;

        if (data instanceof Array) {
            data.length = this._len;

            if (hasTypedArray) {
                this.data = new Float32Array(data);
            }
        }
    }

    arc(cx, cy, r, startAngle, endAngle, anticlockwise) {
        this.addData(CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1);
        this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
        this._xi = mathCos(endAngle) * r + cx;
        this._yi = mathSin(endAngle) * r + cx;
        return this;
    }

    addData(cmd) {
        if (!this._saveData) {
            return;
        }

        // TODO
    }
}

PathProxy.CMD = CMD;
module.exports = PathProxy;
