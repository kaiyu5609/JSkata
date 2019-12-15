import { isUndef } from "../util/index";
import VNode from "./vnode";


export function createComponent (
    Ctor: any | void,
    data?: any,
    context?: any,
    children?: any,
    tag?: string
) {
    if (isUndef(Ctor)) {
        return
    }

    data = data || {}
    
    let propsData = {}

    let listeners = {}


    // intallComponentHooks(data)

    const name = 'App'
    const vnode = new VNode(
        `kyue-component-${Ctor._uid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,
        { Ctor, propsData, listeners, tag, children }
    ) 
    
    return vnode
}