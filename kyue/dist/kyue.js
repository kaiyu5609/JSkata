
/**
 * Kyue v1.0.0
 * (c) 2020 kaiyu5609
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.kyue = factory());
}(this, function () { 'use strict';

    // 这些助手由于其明确性和功能内联性，因此可以在JS引擎中生成更好的VM代码。
    function isUndef(v) {
        return v === undefined || v === null;
    }
    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isTrue(v) {
        return v === true;
    }
    /**
     * 检查值是否为基础类型的
     * @param value
     */
    function isPrimitive(value) {
        return (typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'symbol' ||
            typeof value === 'boolean');
    }
    /**
     * 快速对象检查-当我们知道值是JSON兼容类型时，主要用于从原始值告诉对象
     * @param obj
     */
    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }
    /**
     * 获取值的原始类型字符串，例如：[object Object]
     */
    var _toString = Object.prototype.toString;
    function isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]';
    }
    /**
     * 将值转换为实际呈现的字符串
     * @param val
     */
    function toString(val) {
        return val == null
            ? ''
            : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
                ? JSON.stringify(val, null, 2)
                : String(val);
    }
    /**
     * 从数组中删除项目
     * @param arr
     * @param item
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1);
            }
        }
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }
    /**
     * 将类似数组的对象转换为真实数组
     * @param list
     * @param start
     */
    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }
    /**
     * 将属性混合到目标对象中
     * @param to
     * @param from
     */
    function extend(to, from) {
        for (var key in from) {
            to[key] = from[key];
        }
        return to;
    }
    function noop(a, b, c) { }
    var bind = function (fn, ctx) {
        return fn.bind(ctx);
    };
    //# sourceMappingURL=util.js.map

    var warn = noop;
    {
        var hasConsole_1 = typeof console !== 'undefined';
        warn = function (msg, vm) {
            var trace = ''; // TODO
            // TODO
            if (hasConsole_1) {
                console.error("[Kyue warn]: " + msg + trace);
            }
        };
    }
    //# sourceMappingURL=debug.js.map

    var strats = {};
    /**
     * Default strategy
     */
    var defaultStrat = function (parentVal, childVal) {
        return childVal === undefined
            ? parentVal
            : childVal;
    };
    /**
     *
     * @param parent
     * @param child
     * @param vm
     */
    function mergeOptions(parent, child, vm) {
        var options = {};
        var key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }
        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options;
    }
    //# sourceMappingURL=options.js.map

    /**
     * 用于解析html标签，组件名称和属性路径的unicode字母。
     */
    var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
    /**
     * Define a property
     */
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }
    //# sourceMappingURL=lang.js.map

    /**
     * 选择元素
     * @param el 元素id、class、DOM
     */
    function query(el) {
        if (typeof el === 'string') {
            var selected = document.querySelector(el);
            if (!selected) {
                 console.log('Cannot find element: ' + el);
                return document.createElement('div');
            }
            return selected;
        }
        else {
            return el;
        }
    }
    //# sourceMappingURL=index.js.map

    var uid = 0;
    /**
     * 一个dep是一个可观察的对象，可以有多个订阅它的指令。
     * 建立数据与watcher之间的桥梁
     */
    var Dep = /** @class */ (function () {
        function Dep() {
            this.id = uid++;
            this.subs = [];
        }
        Dep.prototype.addSub = function (sub) {
            this.subs.push(sub);
        };
        Dep.prototype.removeSub = function (sub) {
            remove(this.subs, sub);
        };
        Dep.prototype.depend = function () {
            if (Dep.target) {
                Dep.target.addDep(this);
            }
        };
        Dep.prototype.notify = function () {
            // 首先稳定订户列表
            var subs = this.subs.slice();
            var sub;
            for (var i = 0, l = subs.length; i < l; i++) {
                sub = subs[i];
                sub.update();
            }
        };
        return Dep;
    }());
    /**
     * 当前正在评估的目标观察者。
     * 这是全局唯一的，因为一次只有一个观察者可以评估
     */
    Dep.target = null;
    var targetStack = [];
    function pushTarget(target) {
        targetStack.push(target);
        Dep.target = target;
    }
    function popTarget() {
        targetStack.pop();
        Dep.target = targetStack[targetStack.length - 1];
    }
    //# sourceMappingURL=dep.js.map

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var isBuffer = function isBuffer(arg) {
      return arg instanceof Buffer;
    };

    var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
    });

    var inherits = createCommonjsModule(function (module) {
    try {
      var util$1 = util;
      if (typeof util$1.inherits !== 'function') throw '';
      module.exports = util$1.inherits;
    } catch (e) {
      module.exports = inherits_browser;
    }
    });

    var util = createCommonjsModule(function (module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
      function getOwnPropertyDescriptors(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };

    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }

      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };


    // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      if (typeof process !== 'undefined' && process.noDeprecation === true) {
        return fn;
      }

      // Allow for deprecating things in the process of starting up.
      if (typeof process === 'undefined') {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }

      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }

      return deprecated;
    };


    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || '';
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };


    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;


    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };

    // Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };


    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];

      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
               '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }


    function stylizeNoColor(str, styleType) {
      return str;
    }


    function arrayToHash(array) {
      var hash = {};

      array.forEach(function(val, idx) {
        hash[val] = true;
      });

      return hash;
    }


    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }

      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }

      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);

      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }

      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }

      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }

      var base = '', array = false, braces = ['{', '}'];

      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }

      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }

      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }

      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }

      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }

      ctx.seen.push(value);

      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }

      ctx.seen.pop();

      return reduceToSingleString(output, base, braces);
    }


    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }


    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }


    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
        }
      });
      return output;
    }


    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    }


    function reduceToSingleString(output, base, braces) {
      var length = output.reduce(function(prev, cur) {
        if (cur.indexOf('\n') >= 0) ;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);

      if (length > 60) {
        return braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];
      }

      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }


    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;

    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;

    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;

    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;

    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;

    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;

    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;

    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;

    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;

    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;

    exports.isBuffer = isBuffer;

    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }


    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];

    // 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }


    // log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = inherits;

    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;

      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };

    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

    exports.promisify = function promisify(original) {
      if (typeof original !== 'function')
        throw new TypeError('The "original" argument must be of type Function');

      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== 'function') {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn, enumerable: false, writable: false, configurable: true
        });
        return fn;
      }

      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function (resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function (err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });

        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }

        return promise;
      }

      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

      if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn, enumerable: false, writable: false, configurable: true
      });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    };

    exports.promisify.custom = kCustomPromisifiedSymbol;

    function callbackifyOnRejected(reason, cb) {
      // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
      // Because `null` is a special error value in callbacks which means "no error
      // occurred", we error-wrap so the callback consumer can distinguish between
      // "the promise rejected with null" or "the promise fulfilled with undefined".
      if (!reason) {
        var newReason = new Error('Promise was rejected with a falsy value');
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }

    function callbackify(original) {
      if (typeof original !== 'function') {
        throw new TypeError('The "original" argument must be of type Function');
      }

      // We DO NOT return the promise as it gives the user a false sense that
      // the promise is actually somehow related to the callback's execution
      // and that the callback throwing will reject the promise.
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        var maybeCb = args.pop();
        if (typeof maybeCb !== 'function') {
          throw new TypeError('The last argument must be of type Function');
        }
        var self = this;
        var cb = function() {
          return maybeCb.apply(self, arguments);
        };
        // In true node style we process the callback on `nextTick` with all the
        // implications (stack, `uncaughtException`, `async_hooks`)
        original.apply(this, args)
          .then(function(ret) { process.nextTick(cb, null, ret); },
                function(rej) { process.nextTick(callbackifyOnRejected, rej, cb); });
      }

      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(callbackified,
                              getOwnPropertyDescriptors(original));
      return callbackified;
    }
    exports.callbackify = callbackify;
    });
    var util_1 = util.format;
    var util_2 = util.deprecate;
    var util_3 = util.debuglog;
    var util_4 = util.inspect;
    var util_5 = util.isArray;
    var util_6 = util.isBoolean;
    var util_7 = util.isNull;
    var util_8 = util.isNullOrUndefined;
    var util_9 = util.isNumber;
    var util_10 = util.isString;
    var util_11 = util.isSymbol;
    var util_12 = util.isUndefined;
    var util_13 = util.isRegExp;
    var util_14 = util.isObject;
    var util_15 = util.isDate;
    var util_16 = util.isError;
    var util_17 = util.isFunction;
    var util_18 = util.isPrimitive;
    var util_19 = util.isBuffer;
    var util_20 = util.log;
    var util_21 = util.inherits;
    var util_22 = util._extend;
    var util_23 = util.promisify;
    var util_24 = util.callbackify;

    var MAX_UPDATE_COUNT = 100;
    var queue = [];
    var has = {}; // TODO
    var circular = {}; // TODO
    var waiting = false;
    var flushing = false;
    var index = 0;
    /**
     * 重置调度程序的状态。
     */
    function resetSchedulerState() {
        index = queue.length = 0;
        has = {};
        {
            circular = {};
        }
        waiting = flushing = false;
    }
    /**
     * 刷新队列并运行watchers。
     */
    function flushSchedulerQueue() {
        flushing = true;
        var watcher, id;
        /**
         * 先排序，然后再flush
         * 这样可以确保:
         * 1. 组件从父到子更新。 （因为父级总是在子级之前创建的）
         * 2. 组件用户自定义的watchers在渲染watcher之前运行
         *  （因为用户自定义的watchers是在渲染watcher之前创建的）
         * 3. 如果在父组件的watcher运行期间销毁了一个组件，则可以跳过该watcher
         */
        queue.sort(function (a, b) { return a.id - b.id; });
        /**
         * 不缓存长度，因为在我们运行现有watchers时可能会推送更多的watchers
         */
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index];
            if (watcher.before) {
                watcher.before();
            }
            id = watcher.id;
            has[id] = null;
            watcher.run();
            // 在开发版本中，检查并停止循环更新。
            if ( has[id] != null) {
                circular[id] = (circular[id] || 0) + 1;
                if (circular[id] > MAX_UPDATE_COUNT) {
                    warn('You may have an infinite update loop' + (watcher.user
                        ? "in watcher with expression \"" + watcher.expression + "\""
                        : "in a component render function."), watcher.vm);
                    break;
                }
            }
        }
        resetSchedulerState();
    }
    /**
     * 将观察者推送到观察者队列中。
     * 具有重复ID的作业将被跳过，除非在刷新队列时，被推送到队列中
     * @param watcher
     */
    function queueWatcher(watcher) {
        var id = watcher.id;
        if (has[id] == null) {
            has[id] = true;
            if (!flushing) {
                queue.push(watcher);
            }
            else {
                /**
                 * 在flush的过程中，又执行queueWatcher时
                 * 需要将当前的watcher插入到按id排序的合适位置，
                 * 如果watcher已经在queue队列中，那么它将立即被运行
                 */
                var i = queue.length - 1;
                while (i < index && queue[i].id > watcher.id) {
                    i--;
                }
                queue.splice(i + 1, 0, watcher);
            }
            /**
             * queue the flush
             * 保证只执行一次
             */
            if (!waiting) {
                waiting = true;
                /**
                 * TODO
                 * nextTick(flushSchedulerQueue)
                 */
                setTimeout(flushSchedulerQueue, 0);
            }
        }
    }
    //# sourceMappingURL=scheduler.js.map

    var uid$1 = 0;
    /**
     * 一个监视程序解析表达式，收集依赖项，并在表达式的值更改时触发回调。
     * 这用于$watch() api和指令。
     */
    var Watcher = /** @class */ (function () {
        function Watcher(vm, expOrFn, cb, options, // TODO
        isRenderWatcher) {
            this.vm = vm;
            if (isRenderWatcher) {
                vm._watcher = this;
            }
            vm._watchers.push(this);
            if (options) {
                this.deep = !!options.deep;
                this.user = !!options.user;
                this.lazy = !!options.lazy;
                this.sync = !!options.sync;
                this.before = options.before;
            }
            else {
                this.deep = this.user = this.lazy = this.sync = false;
            }
            this.cb = cb;
            this.id = ++uid$1;
            this.active = true;
            this.dirty = this.lazy;
            this.deps = [];
            this.newDeps = [];
            this.depIds = new Set();
            this.newDepIds = new Set();
            this.expression =  expOrFn.toString()
                ;
            // 为getter解析表达式
            if (typeof expOrFn === 'function') {
                this.getter = expOrFn;
            }
            else {
                // TODO
                this.getter = noop;
            }
            // 此处源码有调整
            this.value = this.lazy ? undefined : this.get();
        }
        /**
         * 评估getter，然后重新收集依赖关系。
         */
        Watcher.prototype.get = function () {
            pushTarget(this);
            var value;
            var vm = this.vm;
            try {
                // this.getter -> updateComponent
                value = this.getter.call(vm, vm);
            }
            catch (e) {
                if (this.user) ;
                else {
                    throw e;
                }
            }
            finally {
                // deep watch
                if (this.deep) ;
                popTarget();
                this.cleanupDeps();
            }
            return value;
        };
        /**
         * 向此指令添加依赖项。
         * @param dep
         */
        Watcher.prototype.addDep = function (dep) {
            var id = dep.id;
            if (!this.newDepIds.has(id)) {
                this.newDepIds.add(id);
                this.newDeps.push(dep);
                if (!this.depIds.has(id)) {
                    dep.addSub(this);
                }
            }
        };
        /**
         * 清理依赖项集合。
         */
        Watcher.prototype.cleanupDeps = function () {
            var i = this.deps.length;
            while (i--) {
                var dep = this.deps[i];
                if (!this.newDepIds.has(dep.id)) {
                    dep.removeSub(this);
                }
            }
            var tmp = this.depIds;
            this.depIds = this.newDepIds;
            this.newDepIds = tmp;
            this.newDepIds.clear();
            tmp = this.deps;
            this.deps = this.newDeps;
            this.newDeps = tmp;
            this.newDeps.length = 0;
        };
        /**
         * Subscriber 接口
         * 依赖项更改时将调用
         */
        Watcher.prototype.update = function () {
            if (this.lazy) {
                this.dirty = true;
            }
            else if (this.sync) ;
            else {
                queueWatcher(this);
            }
        };
        /**
         * 调度作业接口。
         * 由调度程序调用。
         */
        Watcher.prototype.run = function () {
            if (this.active) {
                var value = this.get();
                if (value !== this.value ||
                    /**
                     * 即使值相同，深度观察者和对象/数组上的观察者也应触发，
                     * 因为该值可能已突变。
                     */
                    util_14(value) ||
                    this.deep) {
                    // set new value
                    var oldValue = this.value;
                    this.value = value;
                    if (this.user) {
                        try {
                            this.cb.call(this.vm, value, oldValue);
                        }
                        catch (e) {
                            // TODO
                        }
                    }
                    else {
                        this.cb.call(this.vm, value, oldValue);
                    }
                }
            }
        };
        return Watcher;
    }());
    //# sourceMappingURL=watcher.js.map

    var activeInstance = null;
    function lifecycleMixin(Kyue) {
        Kyue.prototype._update = function (vnode, hydrating) {
            var vm = this;
            var prevVnode = vm._vnode;
            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode;
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
            }
            else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance;
        };
    }
    function initLifecycle(vm) {
        var options = vm.$options;
        var parent = options.parent;
        if (parent) {
            parent.$children.push(vm);
        }
        vm.$parent = parent;
        vm.$root = parent ? parent.$root : vm;
        vm.$children = [];
    }
    function mountComponent(vm, el, hydrating) {
        vm.$el = el;
        var updateComponent = function () {
            vm._update(vm._render(), hydrating);
        };
        // updateComponent()
        new Watcher(vm, updateComponent, noop, {
            before: function () {
                // console.log('----------before flushSchedulerQueue----------')
            }
        }, true); /* isRenderWatcher */
        // km上其实没有该方法 TODO
        // vm.updateComponent = updateComponent
        return vm;
    }
    //# sourceMappingURL=lifecycle.js.map

    var VNode = /** @class */ (function () {
        function VNode(tag, data, children, text, elm, context, componentOptions) {
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
            this.context = context;
            this.componentOptions = componentOptions;
        }
        return VNode;
    }());
    var createEmptyVNode = function (text) {
        if (text === void 0) { text = ''; }
        var node = new VNode();
        node.text = text;
        return node;
    };
    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val));
    }
    //# sourceMappingURL=vnode.js.map

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);
    var methodsToPatch = [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ];
    /**
     * 拦截变异方法并发出事件
     */
    methodsToPatch.forEach(function (method) {
        // 缓存原始的方法
        var original = arrayProto[method];
        def(arrayMethods, method, function mutator() {
            var args = toArray(arguments);
            var result = original.apply(this, args);
            var ob = this.__ob__;
            var inserted;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }
            if (inserted)
                ob.observeArray(inserted);
            // 通知变更
            ob.dep.notify();
            return result;
        });
    });
    //# sourceMappingURL=array.js.map

    /**
     * 附加到每个观察对象的Observer类。
     * 附加后，观察者将目标对象的属性转换为
     * 用于收集依赖关系并调度更新的getter/setter
     */
    var Observer = /** @class */ (function () {
        function Observer(value) {
            this.value = value;
            this.vmCount = 0;
            // 缓存当前实例到__ob__，并且不作枚举
            def(value, '__ob__', this);
            if (Array.isArray(value)) {
                // TODO
                protoAugment(value, arrayMethods);
                this.observeArray(value);
            }
            else {
                this.walk(value);
            }
        }
        /**
         * 遍历所有属性并将它们转换为getter/setter。
         * 仅当值类型为Object时才应调用此方法
         * @param obj
         */
        Observer.prototype.walk = function (obj) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                defineReactive(obj, keys[i]);
            }
        };
        /**
         * 观察数组
         * @param items
         */
        Observer.prototype.observeArray = function (items) {
            for (var i = 0, l = items.length; i < l; i++) {
                observe(items[i]);
            }
        };
        return Observer;
    }());
    // helpers
    /**
     * 通过截取原型链__proto__，来增强目标对象或数组
     * @param value
     * @param asRootData
     */
    function protoAugment(target, src) {
        target.__proto__ = src;
    }
    /**
     * 尝试为某个值创建一个观察者实例，
     * 如果成功观察到该观察者，则返回新观察者，
     * 如果该值已经包含一个观察者，则返回现有观察者。
     * @param value
     * @param asRootData
     */
    function observe(value, asRootData) {
        if (!isObject(value) || value instanceof VNode) {
            return;
        }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        }
        else if (
            // !isServerRendering() && // TODO
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isKyue) {
            ob = new Observer(value);
        }
        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob;
    }
    /**
     * 在对象上定义反应性属性。
     * @param obj
     * @param key
     * @param val
     * @param constructor
     * @param shallow
     */
    function defineReactive(obj, key, val, customSetter, shallow // 是否深度观测
    ) {
        var dep = new Dep();
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return;
        }
        var getter = property && property.get;
        var setter = property && property.set;
        if ((!getter || setter) && arguments.length === 2) {
            val = obj[key];
        }
        // 递归观测，当然前提val不是基础类型，observe中已作判断
        var childOb = !shallow && observe(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                console.log('getter:', value);
                /***********************依赖收集*************************/
                if (Dep.target) {
                    dep.depend();
                }
                /***********************依赖收集*************************/
                return value;
            },
            set: function reactiveSetter(newVal) {
                console.log('setter:', newVal);
                var value = getter ? getter.call(obj) : val;
                // 新旧的值没有发生改变
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return;
                }
                if ( customSetter) {
                    customSetter();
                }
                // 用于没有setter的访问器属性
                if (getter && !setter)
                    return;
                if (setter) {
                    setter.call(obj, newVal);
                }
                else {
                    val = newVal;
                }
                // 递归观测，当然前提val不是基础类型，observe中已作判断
                childOb = !shallow && observe(newVal);
                /***********************派发更新*************************/
                dep.notify();
                /***********************派发更新*************************/
            }
        });
    }
    //# sourceMappingURL=index.js.map

    var sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };
    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter() {
            return this[sourceKey][key];
        };
        sharedPropertyDefinition.set = function proxySetter(val) {
            this[sourceKey][key] = val;
        };
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }
    function initState(vm) {
        // 初始化vm的监视器列表
        vm._watchers = [];
        var opts = vm.$options;
        if (opts.methods) {
            initMethods(vm, opts.methods);
        }
        if (opts.data) {
            initData(vm);
        }
    }
    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
        var keys = Object.keys(data);
        var i = keys.length;
        while (i--) {
            var key = keys[i];
            proxy(vm, "_data", key);
        }
        // observe data
        observe(data, true); /* asRootData */
    }
    function getData(data, vm) {
        try {
            return data.call(vm, vm);
        }
        catch (e) {
            // TODO
            return {};
        }
        finally {
        }
    }
    function initMethods(vm, methods) {
        for (var key in methods) {
            vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
        }
    }
    //# sourceMappingURL=state.js.map

    var componentVNodeHooks = {
        init: function (vnode, hydrating) {
            var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        },
        prepatch: function (oldVnode, vnode) {
        },
        insert: function (vnode) {
        },
        destroy: function (vnode) {
        }
    };
    var hooksToMerge = Object.keys(componentVNodeHooks);
    function createComponent(Ctor, data, context, children, tag) {
        if (isUndef(Ctor)) {
            return;
        }
        var baseCtor = context.$options._base; // Kyue
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
        }
        if (typeof Ctor !== 'function') {
            {
                warn("Invalid Component definition: " + String(Ctor), context);
            }
            return;
        }
        data = data || {};
        var propsData = {};
        var listeners = {};
        intallComponentHooks(data);
        var name = Ctor.options.name || tag || 'app'; // TODO
        var vnode = new VNode("kyue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children });
        return vnode;
    }
    function createComponentInstanceForVnode(vnode, parent // 当前vm的实例
    ) {
        var options = {
            _isComponent: true,
            _parentVnode: vnode,
            parent: parent
        };
        return new vnode.componentOptions.Ctor(options);
    }
    function intallComponentHooks(data) {
        var hooks = data.hook || (data.hook = {});
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i];
            var existing = hooks[key];
            var toMerge = componentVNodeHooks[key];
            if (existing !== toMerge && !(existing && existing._merged)) {
                hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
            }
        }
    }
    function mergeHook(f1, f2) {
        var merged = function (a, b) {
            f1(a, b);
            f2(a, b);
        };
        merged._merged = true;
        return merged;
    }
    //# sourceMappingURL=create-component.js.map

    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;
    /**
     * 包装函数，以提供更灵活的界面
     * 不会被流程大吼大叫
     * @param context
     * @param tag
     * @param data
     * @param children
     */
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
        }
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE;
        }
        return _createElement(context, tag, data, children, normalizationType);
    }
    function _createElement(context, tag, data, children, normalizationType) {
        if (normalizationType === ALWAYS_NORMALIZE) {
            // 将children转化成Array<VNode>，如：文本节点也会转化成[VNode]
            children = normalizeChildren(children);
        }
        else if (normalizationType === SIMPLE_NORMALIZE) {
            // 将二维Array<VNode>拍成一维Array<VNode>
            children = simpleNormalizeChildren(children);
        }
        var vnode;
        if (typeof tag === 'string') {
            // 普通节点
            vnode = new VNode(tag, data, children);
        }
        else {
            // 组件
            vnode = createComponent(tag, data, context, children);
        }
        return vnode;
    }
    /**
     * TODO
     * @param children
     */
    function simpleNormalizeChildren(children) {
        return children;
    }
    /**
     * TODO
     */
    function normalizeChildren(children) {
        return isPrimitive(children)
            ? [createTextVNode(children)]
            : Array.isArray(children)
                ? children
                : undefined;
    }
    //# sourceMappingURL=create-element.js.map

    // k-for
    function renderList(val, render) {
        var ret, i, l;
        if (Array.isArray(val) || typeof val === 'string') {
            ret = new Array(val.length);
            for (i = 0, l = val.length; i < l; i++) {
                ret[i] = render(val[i], i);
            }
        }
        // TODO
        if (!isDef(ret)) {
            return [];
        }
        ret._isKyList = true;
        return ret;
    }
    //# sourceMappingURL=render-list.js.map

    function installRenderHelpers(target) {
        target._s = toString;
        target._l = renderList;
        target._v = createTextVNode;
        target._e = createEmptyVNode;
    }
    //# sourceMappingURL=index.js.map

    function renderMixin(Kyue) {
        installRenderHelpers(Kyue.prototype);
        Kyue.prototype._render = function () {
            var vm = this;
            var _a = vm.$options, render = _a.render, _parentVnode = _a._parentVnode;
            // 占位符vnode，初始化 _parentVnode 为 undefined
            vm.$vnode = _parentVnode;
            // console.log('_render:', 'vm.$vnode = _parentVnodes (' + (_parentVnode && _parentVnode.tag) + ')')
            var vnode;
            try {
                vnode = render.call(vm, vm.$createElement);
            }
            catch (e) {
            }
            finally {
            }
            // 占位符vnode是渲染vnode的父级
            vnode.parent = _parentVnode;
            return vnode;
        };
    }
    function initRender(vm) {
        vm._vnode = null;
        var options = vm.$options;
        var parentVnode = vm.$vnode = options._parentVnode;
        vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
        vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
    }
    //# sourceMappingURL=render.js.map

    var uid$2 = 0;
    function initMixin(Kyue) {
        Kyue.prototype._init = function (options) {
            console.log('_init:', 'vm\'s init');
            var vm = this;
            vm._uid = uid$2++;
            vm._isKyue = true;
            if (options && options._isComponent) {
                // 优化内部组件实例化，因为动态选项合并非常慢，并且没有内部组件选项需要特殊处理。
                initInternalComponent(vm, options);
            }
            else {
                vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
            }
            vm._self = vm;
            /**
             * 1、noop
             */
            initLifecycle(vm);
            /**
             * 1、给实例添加options.data中数据的代理
             */
            initState(vm);
            /**
             * 1、给实例添加$createElement方法
             */
            initRender(vm);
            if (vm.$options.el) {
                console.log('_init:', 'vm.$mount');
                // 返回的是 vm
                vm.$mount(vm.$options.el);
            }
        };
    }
    function initInternalComponent(vm, options) {
        var opts = vm.$options = Object.create(vm.constructor.options);
        var parentVnode = options._parentVnode;
        opts.parent = options.parent;
        opts._parentVnode = parentVnode;
        var vnodeComponentOptions = parentVnode.componentOptions;
        opts.propsData = vnodeComponentOptions.propsData;
        opts._parentListeners = vnodeComponentOptions.listeners;
        opts._renderChildren = vnodeComponentOptions.children;
        opts._componentTag = vnodeComponentOptions.tag;
        if (options.render) {
            opts.render = options.render;
        }
    }
    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options;
        return options;
    }
    //# sourceMappingURL=init.js.map

    function createFnInvoker(fns) {
        function invoker() {
            var fns = invoker.fns;
            if (Array.isArray(fns)) {
                var cloned = fns.slice();
                for (var i = 0; i < cloned.length; i++) {
                    cloned[i].apply(null, arguments);
                }
            }
            else {
                return fns.apply(null, arguments);
            }
        }
        invoker.fns = fns;
        return invoker;
    }
    var normalizeEvent = function (name) {
        return {
            name: name
        };
    };
    function updateListeners(on, oldOn, add, remove, vm) {
        var name, def, cur, old, event;
        for (name in on) {
            def = cur = on[name];
            old = oldOn[name];
            event = normalizeEvent(name);
            if (isUndef(cur)) ;
            else if (isUndef(old)) {
                if (isUndef(cur.fns)) {
                    cur = on[name] = createFnInvoker(cur);
                }
                add(event.name, cur);
            }
            else if (cur !== old) {
                old.fns = cur;
                on[name] = old;
            }
        }
        for (name in oldOn) {
            if (isUndef(on[name])) {
                event = normalizeEvent(name);
                remove(event.name, oldOn.name);
            }
        }
    }
    //# sourceMappingURL=update-listeners.js.map

    var target;
    function add(event, handler) {
        // TODO
        target.addEventListener(event, handler, false);
    }
    function remove$1(event, handler) {
        // TODO
        target.removeEventListener(event, handler, false);
    }
    function updateDOMListeners(oldVnode, vnode) {
        if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
            return;
        }
        var on = vnode.data.on || {};
        var oldOn = oldVnode.data.on || {};
        target = vnode.elm;
        // TODO
        updateListeners(on, oldOn, add, remove$1, vnode.context);
        target = undefined;
    }
    var events = {
        create: updateDOMListeners,
        update: updateDOMListeners
    };
    //# sourceMappingURL=events.js.map

    var emptyNode = new VNode('', {}, []);
    function emptyNodeAt(elm) {
        return new VNode(elm.tagName.toLocaleLowerCase(), {}, [], undefined, elm);
    }
    // TODO
    function sameVnode(a, b) {
        return (a.key === b.key && (a.tag === b.tag &&
            isDef(a.data) === isDef(b.data)));
    }
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {
        console.log('createElm:', vnode);
        /****组件的创建****/
        if (createComponent$1(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }
        /****普通节点的创建****/
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if (isDef(tag)) {
            vnode.elm = document.createElement(tag);
            createChildren(vnode, children, insertedVnodeQueue);
            if (data) {
                setData(vnode, data);
                invokeCreateHooks(vnode);
            }
            insert(parentElm, vnode.elm, refElm);
        }
        else if (isTrue(vnode.isComment)) ;
        else {
            // 文本节点
            vnode.elm = document.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null);
            }
        }
        else if (isPrimitive(vnode.text)) {
            var text = String(vnode.text || vnode.children);
            vnode.elm.appendChild(document.createTextNode(text));
        }
    }
    function setData(vnode, data) {
        for (var key in data) {
            if (key == 'attrs') {
                for (var attr in data[key]) {
                    vnode.elm.setAttribute(attr, data[key][attr]);
                }
            }
        }
    }
    function insert(parent, elm, ref) {
        if (parent) {
            if (ref) {
                if (ref.parentNode === parent) {
                    parent.insertBefore(elm, ref);
                }
            }
            else {
                parent.appendChild(elm);
            }
        }
    }
    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(vnodes[startIdx], insertedVnodeQueue, refElm);
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    // TODO
                    removeNode(ch.elm);
                }
                else { // Text node
                    removeNode(ch.elm);
                }
            }
        }
    }
    function removeNode(el) {
        var parent = el.parentNode;
        if (isDef(parent)) {
            parent.removeChild(el);
        }
    }
    function isPatchable(vnode) {
        while (vnode.componentInstance) {
            vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        var oldStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newStartIdx = 0;
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var refElm;
        /**
         * TODO
         * 删掉
         */
        var index = 0;
        var COUNT = 100;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            index++;
            if (index > COUNT) {
                break;
            }
            if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx];
            }
            else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                // 两个新旧开始 相同的节点
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) ;
            else if (sameVnode(oldStartVnode, newEndVnode)) ;
            else if (sameVnode(oldEndVnode, newStartVnode)) ;
        }
        /**
         * 新增的节点
         */
        if (oldStartIdx > oldEndIdx) {
            refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
        if (oldVnode === vnode) {
            return;
        }
        var elm = vnode.elm = oldVnode.elm;
        var i;
        var data = vnode.data;
        /**
         * 执行钩子函数
         */
        if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
            i(oldVnode, vnode);
        }
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        /*******************************/
        /**
         * 执行update的钩子函数
         * TODO
         */
        // 事件从新绑定
        if (isDef(data) && isPatchable(vnode)) {
            setTimeout(function () {
                events.update(oldVnode, vnode);
            }, 10);
        }
        /*******************************/
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) ;
            else if (isDef(oldCh)) ;
            else if (isDef(oldVnode.text)) {
                elm.textContent = '';
            }
        }
        else if (oldVnode.text !== vnode.text) {
            elm.textContent = vnode.text;
        }
        /**
         * 执行钩子函数
         */
        if (isDef(data)) {
            if (isDef(i = data.hook) && isDef(i = i.postpatch))
                i(oldVnode, vnode);
        }
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        events.create(emptyNode, vnode);
    }
    function patch(oldVnode, vnode, hydrating, removeOnyl) {
        var insertedVnodeQueue = [];
        if (isUndef(oldVnode)) {
            createElm(vnode, insertedVnodeQueue);
        }
        else {
            var isRealElement = isDef(oldVnode.nodeType);
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                console.log('Update:', 'patchVnode');
                patchVnode(oldVnode, vnode, insertedVnodeQueue);
                console.log('----------Updated----------');
            }
            else {
                if (isRealElement) {
                    oldVnode = emptyNodeAt(oldVnode);
                }
                var oldElm = oldVnode.elm;
                var parentElm = oldElm.parentNode;
                createElm(vnode, insertedVnodeQueue, oldElm._leaveCb ? null : parentElm, oldElm.nextSibling);
                if (parentElm) {
                    removeVnodes([oldVnode], 0, 0);
                }
            }
        }
        return vnode.elm;
    }
    function createComponent$1(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data;
        if (isDef(i)) {
            if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false); /* hydrating */
            }
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode);
                insert(parentElm, vnode.elm, refElm);
                return true;
            }
        }
    }
    function initComponent(vnode, insertedVnodeQueue) {
        vnode.elm = vnode.componentInstance.$el;
    }

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + unicodeRegExp.source + "]*";
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
    var startTagOpen = new RegExp("^<" + qnameCapture);
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
    var shouldIgnoreFirstNewline = function (tag, html) { return tag && html[0] === '\n'; };
    function parseHTML(html, options) {
        var stack = [];
        var index = 0;
        var lastTag;
        var MAX = 100;
        var count = 0;
        while (html) {
            count++;
            if (count > MAX) {
                break;
            }
            // TODO
            if (!lastTag || true) {
                var textEnd = html.indexOf('<');
                if (textEnd === 0) {
                    // ③ step
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        var curIndex = index;
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index);
                        continue;
                    }
                    // ① step
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                            advance(1);
                        }
                        continue;
                    }
                }
                var text = void 0;
                // ② step
                if (textEnd >= 0) {
                    // TODO detail
                    text = html.substring(0, textEnd);
                }
                if (textEnd < 0) {
                    text = html;
                }
                if (text) {
                    advance(text.length);
                }
                if (options.chars && text) {
                    options.chars(text, index - text.length, index);
                }
            }
        }
        function advance(n) {
            index += n;
            html = html.substring(n);
        }
        /**
         * 开始标签的解析
         */
        function parseStartTag() {
            /**
             * start: [ "<ul", "ul" ]
             */
            var start = html.match(startTagOpen);
            if (start) {
                var match = {
                    tagName: start[1],
                    attrs: [],
                    start: index
                };
                advance(start[0].length);
                var end = void 0, attr = void 0;
                /**
                 * 解析节点的属性
                 * 1. 不是节点闭合标签
                 * 2. 匹配动态属性表达式 或者是 静态属性表达式
                 */
                while (!(end = html.match(startTagClose)) &&
                    (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                    /**
                     * attr: [ " :class=\"bindClass\"", ":class", "=", "bindClass", null, null ]
                     */
                    attr.start = index;
                    advance(attr[0].length);
                    attr.end = index;
                    match.attrs.push(attr);
                }
                /**
                 * end: [ ">", "" ]
                 */
                if (end) {
                    match.unarySlash = end[1];
                    advance(end[0].length);
                    match.end = index;
                    return match;
                }
            }
        }
        function handleStartTag(match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;
            // TODO
            var unary = !!unarySlash;
            var l = match.attrs.length;
            var attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: value // decodeAttr
                };
            }
            if (!unary) {
                stack.push({
                    tag: tagName,
                    lowerCasedTag: tagName.toLowerCase(),
                    attrs: attrs,
                    start: match.start,
                    end: match.end
                });
                lastTag = tagName;
            }
            /**
             * 执行 options.start
             * 构建AST树
             */
            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }
        function parseEndTag(tagName, start, end) {
            var pos, lowerCasedTagName;
            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break;
                    }
                }
            }
            else {
                pos = 0;
            }
            if (pos >= 0) {
                for (var i = stack.length - 1; i >= pos; i--) {
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag;
            }
        }
    }
    //# sourceMappingURL=html-parser.js.map

    function getAndRemoveAttr(el, name, removeFromMap) {
        var val;
        if ((val = el.attrsMap[name]) != null) {
            var list = el.attrsList;
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i].name === name) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (removeFromMap) {
            delete el.attrsMap[name];
        }
        return val;
    }
    function getBindingAttr(el, name, getStatic) {
        var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'k-bind:' + name);
        if (dynamicValue != null) {
            return dynamicValue;
        }
        else if (getStatic !== false) {
            var staticValue = getAndRemoveAttr(el, name);
            if (staticValue != null) {
                return JSON.stringify(staticValue);
            }
        }
    }
    // TODO
    function addHandler(el, name, value, range) {
        var events = el.events || (el.events = {});
        var newHandler = {
            value: value.trim()
        };
        var handlers = events[name];
        // TODO
        if (Array.isArray(handlers)) {
            handlers.push(newHandler);
        }
        else if (handlers) {
            events[name] = [handlers, newHandler];
        }
        else {
            events[name] = newHandler;
        }
        el.plain = false;
    }
    // TODO
    function pluckModuleFunction(modules, key) {
        return modules
            ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
            : [];
    }
    //# sourceMappingURL=helpers.js.map

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    function parseText(text, delimiters) {
        // TODO
        var tagRE = delimiters ? delimiters : defaultTagRE;
        if (!tagRE.test(text)) {
            return;
        }
        var tokens = [];
        var rowTokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index;
        while ((match = tagRE.exec(text))) {
            index = match.index;
            // TODO
            var exp = match[1].trim();
            tokens.push("_s(" + exp + ")");
            rowTokens.push({ '@binding': exp });
            lastIndex = index + match[0].length;
        }
        // TODO
        return {
            expression: tokens.join('+'),
            tokens: rowTokens
        };
    }
    //# sourceMappingURL=text-parser.js.map

    var onRE = /^@|^k-on:/;
    // TODO
    var dirRE = /^k-|^@|^:/;
    var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    var stripParensRE = /^\(|\)$/g;
    var delimiters;
    var transforms;
    function createASTElement(tag, attrs, parent) {
        return {
            type: 1,
            tag: tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            // TODO
            parent: parent,
            children: []
        };
    }
    /**
     * 将 HTML string 转换成 AST。
     * @param template
     * @param options
     */
    function parse(template, options) {
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        var stack = [];
        var root;
        var currentParent;
        function closeElement(element) {
            // console.log('element', element)
            if (!element.processed) {
                element = processElement(element, options);
            }
            if (currentParent && !element.forbidden) {
                currentParent.children.push(element);
                element.parent = currentParent;
            }
        }
        parseHTML(template, Object.assign({}, options, {
            start: function (tag, attrs, unary, start, end) {
                var element = createASTElement(tag, attrs, currentParent);
                if (!element.processed) {
                    // 结构指令
                    processFor(element);
                    processIf(element);
                }
                if (!root) {
                    root = element;
                }
                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                }
            },
            end: function (tag, start, end) {
                var element = stack[stack.length - 1];
                stack.length -= 1;
                currentParent = stack[stack.length - 1];
                closeElement(element);
            },
            chars: function (text, start, end) {
                if (!currentParent) {
                    return;
                }
                var children = currentParent.children;
                if (text) {
                    var res = void 0, child = void 0;
                    if (text !== '' && (res = parseText(text, delimiters))) {
                        child = {
                            type: 2,
                            expression: res.expression,
                            tokens: res.tokens,
                            text: text
                        };
                    }
                    if (child) {
                        children.push(child);
                    }
                }
            }
        }));
        return root;
    }
    function makeAttrsMap(attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
            // TODO
            map[attrs[i].name] = attrs[i].value;
        }
        return map;
    }
    function processFor(el) {
        var exp;
        if ((exp = getAndRemoveAttr(el, 'k-for'))) {
            var res = parseFor(exp);
            if (res) {
                extend(el, res);
            }
        }
    }
    function parseFor(exp) {
        var inMatch = exp.match(forAliasRE);
        if (!inMatch)
            return;
        var res = {};
        res.for = inMatch[2].trim();
        var alias = inMatch[1].trim().replace(stripParensRE, '');
        var iteratorMatch = alias.match(forIteratorRE);
        if (iteratorMatch) {
            res.alias = alias.replace(forIteratorRE, '').trim();
            res.iterator1 = iteratorMatch[1].trim();
            if (iteratorMatch[2]) {
                res.iterator2 = iteratorMatch[2].trim();
            }
        }
        else {
            res.alias = alias;
        }
        return res;
    }
    function processIf(el) {
        var exp = getAndRemoveAttr(el, 'k-if');
        if (exp) {
            el.if = exp;
            addIfCondition(el, {
                exp: exp,
                block: el
            });
        }
        else {
            if (getAndRemoveAttr(el, 'k-else') != null) {
                el.else = true;
            }
            var elseif = getAndRemoveAttr(el, 'k-else-if');
            if (elseif) {
                el.elseif = elseif;
            }
        }
    }
    function addIfCondition(el, condition) {
        if (!el.ifConditions) {
            el.ifConditions = [];
        }
        el.ifConditions.push(condition);
    }
    function processElement(element, options) {
        // TODO
        for (var i = 0; i < transforms.length; i++) {
            element = transforms[i](element, options) || element;
        }
        processAttrs(element);
        return element;
    }
    function processAttrs(el) {
        var list = el.attrsList;
        var i, l, name, rawName, value;
        for (i = 0, l = list.length; i < l; i++) {
            name = rawName = list[i].name;
            value = list[i].value;
            if (dirRE.test(name)) {
                el.hasBindings = true;
                // 阻止冒泡 TODO
                if (onRE.test(name)) {
                    // k-on 
                    name = name.replace(onRE, '');
                    addHandler(el, name, value, list[i]);
                }
            }
        }
    }
    //# sourceMappingURL=index.js.map

    function genHandlers(events, isNative) {
        var res = isNative ? 'nativeOn:{' : 'on:{';
        for (var name_1 in events) {
            res += "\"" + name_1 + "\":" + getHandler(name_1, events[name_1]) + ",";
        }
        return res.slice(0, -1) + '}';
    }
    var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
    var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;
    function getHandler(name, handler) {
        if (!handler) {
            return 'function(){}';
        }
        if (Array.isArray(handler)) {
            return "[" + handler.map(function (handler) { return getHandler(name, handler); }).join(',') + "]";
        }
        var isMethodPath = simplePathRE.test(handler.value);
        var isFunctionExpression = fnExpRE.test(handler.value);
        if (!handler.modifiers) {
            if (isMethodPath || isFunctionExpression) {
                return handler.value;
            }
            return "function($event){" + handler.value + "}";
        }
    }
    //# sourceMappingURL=events.js.map

    var CodegenState = /** @class */ (function () {
        function CodegenState(options) {
            this.options = options;
            this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
        }
        return CodegenState;
    }());
    function generate(ast, options) {
        var state = new CodegenState(options);
        var code = ast ? genElement(ast, state) : '_c("dvi")';
        return {
            render: "with(this){return " + code + "}"
        };
    }
    function genElement(el, state) {
        if (el.for && !el.forProcessed) {
            return genFor(el, state);
        }
        else if (el.if && !el.ifProcessed) {
            return genIf(el, state);
        }
        else {
            var code = void 0;
            var data = genData(el, state);
            var children = genChildren(el, state, true);
            code = "_c('" + el.tag + "'" + (data ? "," + data : '' // data
            ) + (children ? "," + children : '' // children
            ) + ")";
            return code;
        }
    }
    function genIf(el, state) {
        el.ifProcessed = true;
        return genIfConditions(el.ifConditions.slice(), state);
    }
    function genIfConditions(conditions, state) {
        if (!conditions.length) {
            return '_e()';
        }
        var condition = conditions.shift();
        if (condition.exp) {
            return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state);
        }
        else {
            return "" + genTernaryExp(condition.block);
        }
        function genTernaryExp(el) {
            // TODO
            return genElement(el, state);
        }
    }
    function genData(el, state) {
        var data = '{';
        // 模块数据生成方法
        for (var i = 0; i < state.dataGenFns.length; i++) {
            data += state.dataGenFns[i](el);
        }
        // event hanlders
        if (el.events) {
            data += genHandlers(el.events, false) + ",";
        }
        data = data.replace(/,$/, '') + '}';
        return data;
    }
    function genChildren(el, state, checkSkip) {
        var children = el.children;
        if (children.length) {
            var el_1 = children[0];
            // TODO
            if (children.length === 1 && el_1.for) {
                var normalizationType_1 = checkSkip
                    ? ",0" : "";
                return "" + genElement(el_1, state) + normalizationType_1;
            }
            // TODOs
            var normalizationType = getNormalizationType();
            var gen_1 = genNode;
            return "[" + children.map(function (c) { return gen_1(c, state); }).join(',') + "]" + (normalizationType ? "," + normalizationType : '');
        }
    }
    function getNormalizationType(children, maybeComponent) {
        // TODO
        return 0;
    }
    function genNode(node, state) {
        // TODO
        if (node.type === 1) {
            return genElement(node, state);
        }
        else {
            return genText(node);
        }
    }
    function genText(text) {
        return "_v(" + (text.type === 2
            ? text.expression
            : JSON.stringify(text.text)) + ")";
    }
    function genFor(el, state) {
        var exp = el.for;
        var alias = el.alias;
        var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
        var iterator2 = el.iterator2 ? "," + el.iterator2 : '';
        el.forProcessed = true;
        return "_l((" + exp + "),function(" + alias + iterator1 + iterator2 + "){" +
            ("return " + genElement(el, state)) +
            "})";
    }
    //# sourceMappingURL=index.js.map

    function createFunction(code, errors) {
        try {
            return new Function(code);
        }
        catch (err) {
            errors.push({ err: err, code: code });
            return noop;
        }
    }
    function createCompileToFunctionFn(compile) {
        var cache = Object.create(null);
        return function compileToFunctions(template, options, vm) {
            options = extend({}, options);
            var key = template;
            if (cache[key]) {
                return cache[key];
            }
            var compiled = compile(template, options);
            var res = {};
            var fnGenErrors = [];
            res.render = createFunction(compiled.render, fnGenErrors);
            return (cache[key] = res);
        };
    }
    //# sourceMappingURL=to-function.js.map

    function transformNode(el, options) {
        var staticClass = getAndRemoveAttr(el, 'class');
        if (staticClass) {
            el.staticClass = JSON.stringify(staticClass);
        }
        var classBinding = getBindingAttr(el, 'class', false);
        if (classBinding) {
            el.classBinding = classBinding;
        }
    }
    function genData$1(el) {
        // class
        var data = '';
        if (el.staticClass) {
            data += "staticClass:" + el.staticClass + ",";
        }
        if (el.classBinding) {
            data += "class:" + el.classBinding + ",";
        }
        return data;
    }
    var klass = {
        staticKeys: ['staticClass'],
        transformNode: transformNode,
        genData: genData$1
    };
    //# sourceMappingURL=class.js.map

    var modules = [
        klass
    ];
    //# sourceMappingURL=index.js.map

    /********************************src/compiler/create-compiler***********************************/
    function createCompilerCrerator(baseCompile) {
        return function createCompiler(baseOptions) {
            function compile(template, options) {
                var finalOptions = Object.create(baseOptions);
                var compiled = baseCompile(template.trim(), finalOptions);
                return compiled;
            }
            return {
                compile: compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            };
        };
    }
    /********************************src/compiler/index***********************************/
    var createCompiler = createCompilerCrerator(function baseCompile(template, options) {
        var ast = parse(template.trim(), options);
        console.log('ast', ast);
        var code = generate(ast, options);
        return {
            ast: ast,
            render: code.render
        };
    });
    /********************************platforms/web/compiler/index***********************************/
    // TODO
    var baseOptions = {
        modules: modules
    };
    var _a = createCompiler(baseOptions), compileToFunctions = _a.compileToFunctions;
    //# sourceMappingURL=index.js.map

    // @ts-nocheck
    function Kyue(options) {
        if ( !(this instanceof Kyue)) {
            warn('Kyue is a constructor and should be called with the `new` keyword');
        }
        this._init(options);
    }
    Kyue.prototype.$mount = function (el, hydrating) {
        // compile TODO
        var options = this.$options;
        if (!options.render) {
            var template = options.template;
            if (template) {
                var render = compileToFunctions(template, {}).render;
                options.render = render;
            }
        }
        el = el && query(el);
        return mountComponent(this, el, hydrating);
    };
    Kyue.prototype.__patch__ = patch;
    /**
     * 1、给实例添加_init方法
     * 2、组件调用 $mount 方法进行挂载
     */
    initMixin(Kyue);
    /**
     * 1、给实例添加_update方法
     *
     */
    lifecycleMixin(Kyue);
    /**
     * 1、给实例添加_render方法
     *  该方法生成虚拟DOM：vnode
     */
    renderMixin(Kyue);
    /**
     * 全局API
     * 书写位置TODO
     */
    Kyue.options = Object.create(null);
    Kyue.options._base = Kyue;
    Kyue.cid = 0;
    var cid = 1;
    Kyue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var SuperId = Super.cid;
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId];
        }
        var name = extendOptions.name || Super.options.name;
        var Sub = function KyueComponent(options) {
            this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub.super = Super;
        Sub.extend = Super.extend;
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub;
    };

    //# sourceMappingURL=index.js.map

    return Kyue;

}));
//# sourceMappingURL=kyue.js.map
