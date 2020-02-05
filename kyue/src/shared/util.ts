// 这些助手由于其明确性和功能内联性，因此可以在JS引擎中生成更好的VM代码。
export function isUndef (v: any): boolean {
    return v === undefined || v === null
}

export function isDef (v: any): boolean {
    return v !== undefined && v !== null
}

export function isTrue (v: any): boolean {
    return v === true
}

export function isFalse (v: any): boolean {
    return v === false
}

/**
 * 检查值是否为基础类型的
 * @param value 
 */
export function isPrimitive (value: any): boolean {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * 快速对象检查-当我们知道值是JSON兼容类型时，主要用于从原始值告诉对象
 * @param obj 
 */
export function isObject (obj: any): boolean {// TODO mixed
    return obj !== null && typeof obj === 'object'
}

/**
 * 获取值的原始类型字符串，例如：[object Object]
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
    return _toString.call(value).slice(8, -1)
}

export function isPlainObject (obj: any): boolean {
    return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v: any): boolean {
    return _toString.call(v) === '[object RegExp]'
}

export function isPromise (val: any): boolean {
    return (
        isDef(val) && 
        typeof val.then === 'function' && 
        typeof val.catch === 'function'
    )
}

/**
 * 将值转换为实际呈现的字符串
 * @param val 
 */
export function toString(val: any): string {
    return val == null 
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
            ? JSON.stringify(val, null, 2)
            : String(val)
}

/**
 * 将输入值转换为数字以保持持久性
 * 如果转换失败，则返回原始字符串
 * @param val 
 */
export function toNumber (val: string): number | string {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}

/**
 * 从数组中删除项目
 * @param arr 
 * @param item 
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<any>, key: string): boolean {
    return hasOwnProperty.call(obj, key)
}

/**
 * 将类似数组的对象转换为真实数组
 * @param list 
 * @param start 
 */
export function toArray (list: any, start?: number): Array<any> {
    start = start || 0
    let i = list.length - start
    const ret: Array<any> = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

/**
 * 将属性混合到目标对象中
 * @param to 
 * @param from 
 */
export function extend (to: any, from?: any): Object {// TODO Object
    for (const key in from) {
        to[key] = from[key]
    }
    return to
}


export function noop(a?: any, b?: any, c?: any) {}

/**
 * 返回相同的值
 * @param _ 
 */
export const identity = (_: any) => _

/**
 * 确保一个函数仅被调用一次
 * @param fn 
 */
export function once (fn: Function): Function {
    let called = false
    return function() {
        if (!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}

export const bind = function(fn: Function, ctx: any): Function {
    return fn.bind(ctx)
}