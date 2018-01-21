var Element = require("../Element");
var Style = require("./Style");
var zrUtil = require("../core/util");

class Displayable extends Element {

    constructor(opts) {
        opts = opts || {};
        super(opts);

        this.type = 'displayable';

        for (var name in opts) {
            if (opts.hasOwnProperty(name) && name !== 'style') {
                this[name] = opts[name];
            }
        }

        this.style = new Style(opts.style, this);
        this._rect = null;
        this.__clipPaths = [];
    }

    dirty() {
        this._dirty = true;
        this._rect = null;
        this.__zr && this.__zr.refresh();
    }

    beforeBrush(ctx) {

    }

    afterBrush(ctx) {

    }

    attrKV(key, value) {
        if (key !== 'style') {
            super.attrKV.call(this, key, value);
        } else {
            this.style.set(value);
        }
    }
}

module.exports = Displayable;
