import { initLifecycle } from './lifecycle'
import { initState } from './state'
import { initRender } from './render'

let uid = 0

export function initMixin(Kyue: any) {
    Kyue.prototype._init = function(options?: Object) {
        console.log('_init:', 'vm\'s init')

        const vm = this

        vm._uid = uid++

        vm._self = vm

        vm.$options = options

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