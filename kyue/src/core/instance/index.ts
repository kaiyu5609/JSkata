// @ts-nocheck

import { warn, query } from '../util/index'
import { initMixin } from './init'
import { lifecycleMixin, mountComponent } from './lifecycle'
import { renderMixin } from './render'
import { patch } from '../vdom/patch'

function Kyue(options: any) {
    if (process.env.NODE_ENV !== 'production' && !(this instanceof Kyue)) {
        warn('Kyue is a constructor and should be called with the `new` keyword')
    }
    
    this._init(options)
}

Kyue.prototype.$mount = function(el?: string | Element, hydrating?: boolean) {
    el = el && query(el)

    return mountComponent(this, el, hydrating)
}

Kyue.prototype.__patch__ = patch

/**
 * 1、给实例添加_init方法
 * 2、组件调用 $mount 方法进行挂载
 */ 
initMixin(Kyue)
/**
 * 1、给实例添加_update方法 
 *  
 */ 
lifecycleMixin(Kyue)
/**
 * 1、给实例添加_render方法
 *  该方法生成虚拟DOM：vnode
 */ 
renderMixin(Kyue)


export default Kyue