var STYLE_COMMON_PROPS = [
    ['shadowBlur', 0],
    ['shadowOffsetX', 0],
    ['shadowOffsetY', 0],
    ['shadowColor', '#000'],
    ['lineCap', 'butt'],
    ['lineJoin', 'miter'],
    ['miterLimit', 10]
];

class Style {
    constructor(opts, host) {
        this.extendFrom(opts, false);
        this.host = host;

        this.lineWidth = 1;
        this.lineDash = null;
        this.lineDashOffset = 0;
    }

    extendFrom(otherStyle, overwrite) {
        if (otherStyle) {
            for (var name in otherStyle) {
                if (otherStyle.hasOwnProperty(name) && (overwrite === true || (overwrite === false ? !this.hasOwnProperty(name) : otherStyle[name] != null))) {
                    this[name] = otherStyle[name];
                }
            }
        }
    }

    bind(ctx, el, prevEl) {
        var style = this;
        var prevStyle = prevEl && prevEl.style;
        var firstDraw = !prevStyle;

        STYLE_COMMON_PROPS.forEach(function(prop, index) {
            var styleName = prop[0];
            if (firstDraw || style[styleName] !== prevStyle[styleName]) {
                ctx[styleName] = style[styleName] || prop[1];
            }
        });

        if (firstDraw || style.fill !== prevStyle.fill) {
            ctx.fillStyle = style.fill;
        }

        if (firstDraw || style.stroke !== prevStyle.stroke) {
            ctx.strokeStyle = style.stroke;
        }

        if (firstDraw || style.opacity !== prevStyle.opacity) {
            ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
        }

        if (firstDraw || style.blend !== prevStyle.blend) {
            ctx.globalCompositeOperation = style.blend || 'source-over';
        }

        if (this.hasStroke()) {
            var lineWidth = style.lineWidth;
            ctx.lineWidth = lineWidth / (this.strokeNoScale && el && el.getLineScale ? el.getLineScale() : 1);
        }
    }

    hasFill() {
        var fill = this.fill;
        return fill != null && fill !== 'none';
    }

    hasStroke() {
        var stroke = this.stroke;
        return stroke != null && stroke !== 'none' && this.lineWidth > 0;
    }

    set(obj, value) {
        if (typeof obj === 'string') {
            this[obj] = value;
        } else {
            this.extendFrom(obj, true);
        }
    }
}

module.exports = Style;
