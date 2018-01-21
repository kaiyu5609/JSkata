var _default = typeof window !== 'undefined'
    && (
        window.requestAnimationFrame
        && window.requestAnimationFrame.bind(window)
        || window.msRequestAnimationFrame
        && window.msRequestAnimationFrame.bind(window)
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
    )
    || function(func) {
        setTimeout(func, 16);
    };
module.exports = _default;
