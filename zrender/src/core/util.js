var arrayProto = Array.prototype;
var nativeSlice = arrayProto.slice;

function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
}

function defaults(target, source, overlay) {
    for (var key in source) {
        if (source.hasOwnProperty(key) && (overlay ? source[key] != null : target[key] == null)) {
            target[key] = source[key];
        }
    }

    return target;
}

function mixin(target, source, overlay) {
    target = 'prototype' in target ? target.prototype : target;
    source = 'prototype' in source ? source.prototype : source;
    defaults(target, source, overlay);
}


function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;

    function F() {}

    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }

    clazz.prototype.construct = clazz;
    clazz.superClass = baseClazz;
}

function bind(func, context) {
    var args = nativeSlice.call(arguments, 2);
    return function() {
        return func.apply(context, args.concat(nativeSlice.call(arguments)));
    };
}

var methods = {};

methods.createCanvas = function() {
    return document.createElement('canvas');
};

function createCanvas() {
    return methods.createCanvas();
}

function isObject(value) {
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}




exports.extend = extend;
exports.mixin = mixin;
exports.inherits = inherits;
exports.bind = bind;
exports.createCanvas = createCanvas;
exports.isObject = isObject;
