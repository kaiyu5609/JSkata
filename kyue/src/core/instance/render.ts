import { createElement } from '../vdom/create-element'

export function renderMixin(Kyue: any) {

    Kyue.prototype._render = function() {
        const vm = this
        const { render, _parentVnode } = vm.$options

        // 初始化 _parentVnode 为 undefined
        vm.$vnode = _parentVnode
        console.log('_render:', 'vm.$vnode = _parentVnodes (' + _parentVnode + ')')

        let vnode

        try {
            vnode = render.call(vm, vm.$createElement)
        } catch (e) {

        } finally {

        }

        vnode.parent = _parentVnode

        return vnode
    }
}

export function initRender(vm: any) {
    vm._vnode = null

    const options = vm.$options
    const parentVnode = vm.$vnode = options._parentVnode

    vm.$createElement = (a: any, b: any, c: any, d: any) => createElement(vm, a, b, c, d, true)
}

