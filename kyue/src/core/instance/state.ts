import { noop } from "../util/index";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy(target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}


export function initState(vm: any) {
    const opts = vm.$options

    if (opts.data) {
        initData(vm)
    }
}


function initData(vm: any) {
    let data = vm.$options.data

    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}

    const keys = Object.keys(data)

    let i = keys.length

    while (i--) {
        const key = keys[i]

        proxy(vm, `_data`, key)
    }

    // TODO observe data
    // ...
}

export function getData(data: Function, vm: any): any {
    try {
        return data.call(vm, vm)
    } catch (e) {
        // TODO
        return {}
    } finally {

    }
}