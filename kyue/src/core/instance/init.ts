import { initLifecycle } from './lifecycle'
import { initState } from './state'
import { initRender } from './render'
import { mergeOptions } from '../util/index'

let uid = 0

export function initMixin(Kyue: any) {
    Kyue.prototype._init = function(options?: any) {
        console.log('_init:', 'vm\'s init')

        const vm = this

        vm._uid = uid++
        
        vm._isKyue = true

        if (options && options._isComponent) {
            // 优化内部组件实例化，因为动态选项合并非常慢，并且没有内部组件选项需要特殊处理。
            initInternalComponent(vm, options)
        } else {
            vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options || {},
                vm
            )
        }
        
        vm._self = vm
        /**
         * 1、noop
         */
        initLifecycle(vm)
        /**
         * 1、给实例添加options.data中数据的代理 
         */ 
        initState(vm)
        /**
         * 1、给实例添加$createElement方法
         */
        initRender(vm)

        if (vm.$options.el) {
            console.log('_init:', 'vm.$mount')
            // 返回的是 vm
            vm.$mount(vm.$options.el)
        }

    }
}

export function initInternalComponent(vm: any, options: any) {
    const opts = vm.$options = Object.create(vm.constructor.options)
    const parentVnode = options._parentVnode
    opts.parent = options.parent
    opts._parentVnode = parentVnode

    const vnodeComponentOptions = parentVnode.componentOptions
    opts.propsData = vnodeComponentOptions.propsData
    opts._parentListeners = vnodeComponentOptions.listeners
    opts._renderChildren = vnodeComponentOptions.children
    opts._componentTag = vnodeComponentOptions.tag

    if (options.render) {
        opts.render = options.render
    }
}

export function resolveConstructorOptions(Ctor: any) {
    let options = Ctor.options


    return options
}