import { isFunction, proxy } from './utils';
import { obverse } from './obverse/index'
export function initState(vm) {
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    // 监听数据
    obverse(data);
}