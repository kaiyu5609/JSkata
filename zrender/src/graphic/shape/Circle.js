var Path = require("../Path");

/**
    context.arc(
        centerx, centery, radius,
        startingAngle, endingAngle,
        anticlockwise = false
    );
    anticlockwise: 默认false是顺时针绘制圆弧

            1.5pi


    1pi                2pi/0pi


            0.5pi

*/

/**
 * 圆形
 * @module zrender/graphic/shape/circle
 * @example
 *   var circle = new Circle({
 *      shape: {
 *          x: 100,
 *          y: 100,
 *          r: 40,
 *      },
 *      style: {
 *          brushType: 'both',
 *          color: 'blue',
 *          strokeColor: 'red',
 *          lineWidth: 3,
 *          text: 'Circle'
 *      }
 *   });
 *   zr.addShape(shape);
 */

/**
 * @typedef {Object} ICircleStyle
 * @property {number} x
 * @property {number} y
 * @property {number} r
 * @property {string} [brushType='fill']
 * @property {string} [color='#000000'] 填充颜色
 * @property {string} [strokeColor='#000000'] 描边颜色
 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
 * @property {number} [lineWidth=1] 描边宽度
 * @property {number} [opacity=1] 绘制透明度
 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
 * @property {string} [shadowColor='#000000'] 阴影颜色
 * @property {number} [shadowOffsetX=0] 阴影横向偏移
 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
 * @property {string} [text] 图形中的附加文本
 * @property {string} [textColor='#000000'] 文本颜色
 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
 * @property {string} [textPosition='end'] 附加文本位置，可以是 inside, left, right, top, bottom
 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。可以是 start, end, left, right, center
 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。可以是 top, bottom, middle, alphabetic, hanging, ideographic
 *
 */

class Circle extends Path {

    constructor(opts) {
        super(opts);

        this.type = 'circle';

        var defaultShape = {
            cx: 0, cy: 0, r: 0
        };

        var thisShape = this.shape = this.shape || {};

        for (var name in defaultShape) {
            if (!thisShape.hasOwnProperty(name) && defaultShape.hasOwnProperty(name)) {
                thisShape[name] = defaultShape[name];
            }
        }
    }

    buildPath(ctx, shape, inBundle) {
        if (inBundle) {
            ctx.moveTo(shape.cx + shape.r, shape.cy);
        }

        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
    }
}

module.exports = Circle;
