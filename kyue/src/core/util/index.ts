
export * from '../../shared/util'
export * from './debug'

/**
 * 选择元素
 * @param el 元素id、class、DOM 
 */
export function query(el: string | Element): Element {
    if (typeof el === 'string') {
        const selected = document.querySelector(el)
        if (!selected) {
            process.env.NODE_ENV !== 'production' && console.log('Cannot find element: ' + el)
            return document.createElement('div')
        }
        return selected
    } else {
        return el
    }
}