import { hasOwn } from '../../shared/util'

const strats: any = {}

/**
 * Default strategy
 */
const defaultStrat = function(parentVal: any, childVal: any): any {
    return childVal === undefined
        ? parentVal
        : childVal
}


/**
 * 
 * @param parent 
 * @param child 
 * @param vm 
 */
export function mergeOptions(
    parent: any,
    child: any,
    vm?: any
) {


    const options: any = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    function mergeField(key: string) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}