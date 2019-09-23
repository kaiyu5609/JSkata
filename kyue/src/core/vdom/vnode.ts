/**
 * vnode
 * {
 *     tag: 'div',// 元素标签名称
 *     data: {
 *         attr: { id: 'app' }// 元素的数据
 *     },
 *     children: []// 子元素
 * }
 */
export default class VNode {
    tag: any;
    data: any;
    children: any;
    text: string;
    elm: any;

    constructor(tag: any, data: any, children: any, text?: string, elm?: Element) {
        this.tag = tag
        this.data = data
        this.children = children

        this.text =  text
        this.elm = elm
    }
}