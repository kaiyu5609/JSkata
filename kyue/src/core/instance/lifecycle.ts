export function lifecycleMixin(Kyue: any) {
    Kyue.prototype._update = function(vnode: any, hydrating?: boolean) {
        const vm = this
        const prevVnode = vm._vnode

        vm._vnode = vnode

        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
        } else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode)
        }


    }
}

export function initLifecycle(vm: any) {

}

export function mountComponent(vm: any, el: Element, hydrating?: boolean) {
    vm.$el = el

    let updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }


    updateComponent()

    // km上其实没有该方法 TODO
    vm.updateComponent = updateComponent

    return vm
}