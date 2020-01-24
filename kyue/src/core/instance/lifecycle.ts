export let activeInstance: any = null

export function lifecycleMixin(Kyue: any) {
    Kyue.prototype._update = function(vnode: any, hydrating?: boolean) {
        const vm = this
        const prevVnode = vm._vnode
        const prevActiveInstance = activeInstance
        activeInstance = vm

        vm._vnode = vnode

        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
        } else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
        activeInstance = prevActiveInstance

    }
}

export function initLifecycle(vm: any) {
    const options = vm.$options

    let parent = options.parent
    if (parent) {
        parent.$children.push(vm)
    }

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
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