import VNode from './vnode'

export function createElement(context: any, tag: any, data: any, children: any) {
    if (Array.isArray(data)) {
        children = data
        data = undefined
    }

    return _createElement(context, tag, data, children)
}

export function _createElement(context: any, tag: any, data: any, children: any) {
    let vnode

    vnode = new VNode(tag, data, children)

    return vnode
}