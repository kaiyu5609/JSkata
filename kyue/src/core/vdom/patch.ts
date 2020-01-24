import VNode from "./vnode"
import { isPrimitive, isDef, isTrue, isUndef } from "../util/index"


function emptyNodeAt(elm: Element) {
    return new VNode(elm.tagName.toLocaleLowerCase(), {}, [], undefined, elm)
}

function createElm(vnode: any, insertedVnodeQueue: [], parentElm?: Element, refElm?: Element) {
    console.log('createElm:', vnode)

    /****组件的创建****/
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
    }

    /****普通节点的创建****/
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag

    if (isDef(tag)) {
        vnode.elm = vnode.ns
            ? document.createElementNS(vnode.ns, tag)
            : document.createElement(tag, vnode)
    
        createChildren(vnode, children, insertedVnodeQueue)
    
        if (data) {
            setData(vnode, data);
        }

        insert(parentElm, vnode.elm, refElm)
    } else if (isTrue(vnode.isComment)) {
        // 注释节点

    } else {
        // 文本节点
        vnode.elm = document.createTextNode(vnode.text)
        insert(parentElm, vnode.elm, refElm)
    }

}

function createChildren(vnode: VNode, children: [], insertedVnodeQueue: []) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; ++i) {
            createElm(children[i], insertedVnodeQueue, vnode.elm, null)
        }
    } else if (isPrimitive(vnode.text)) {
        let text = String(vnode.text || vnode.children)
        vnode.elm.appendChild(document.createTextNode(text))
    }
}

function setData(vnode: any, data: any) {
    for (var key in data) {
        if (key == 'attrs') {
            for (var attr in data[key]) {
                vnode.elm.setAttribute(attr, data[key][attr])
            }
        }
    }
}

function insert(parent: Element, elm: Element, ref: Element) {
    if (parent) {
        if (ref) {
            if (ref.parentNode === parent) {
                parent.insertBefore(elm, ref)
            }
        } else {
            parent.appendChild(elm)
        }
    }
}

function removeVnodes(vnodes: any, startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]
        if (ch) {
            if (ch.tag) {
                // TODO
                removeNode(ch.elm)
            } else {// Text node
                removeNode(ch.elm)
            }
        }
    }
}

function removeNode(el: Element) {
    const parent = el.parentNode

    if (parent) {
        parent.removeChild(el)
    }
}


export function patch(oldVnode: any, vnode: any, hydrating?: boolean, removeOnyl?: boolean) {
    let isInitialPatch = false
    const insertedVnodeQueue: [] = []

    
    if (isUndef(oldVnode)) {
        // 组件的 mount，生成一个新的root元素
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue)
    } else {
        const isRealElement = oldVnode.nodeType

        // TODO sameVnode(oldVnode, vnode)
        if (!isRealElement) {
            console.log('patch.update:', 'sameVnode')



        } else {
            if (isRealElement) {
                oldVnode = emptyNodeAt(oldVnode)
            }

            const oldElm = oldVnode.elm
            const parentElm = oldElm.parentNode
    
            createElm(
                vnode,
                insertedVnodeQueue,
                oldElm._leaveCb ? null : parentElm,
                oldElm.nextSibling
            )

            if (parentElm) {
                removeVnodes([oldVnode], 0, 0)
            }
        }
    }

    return vnode.elm
}


function createComponent(vnode: any, insertedVnodeQueue: [], parentElm: any, refElm: any) {
    let i = vnode.data
    if (isDef(i)) {

        if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false)/* hydrating */
        }

        if (isDef(vnode.componentInstance)) {
            initComponent(vnode, insertedVnodeQueue)
            insert(parentElm, vnode.elm, refElm)
            return true
        }
    }
}

function initComponent(vnode: any, insertedVnodeQueue: []) {
    vnode.elm = vnode.componentInstance.$el

}