import Watcher from './obverse/watcher';
export function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, cb, options) {
        options.user = true;
        new Watcher(this, key, cb, options);
    }
}
export function initWatch(vm, watch) {
    for (let key in watch) {
        let cb = watch[key];
        createWatcher(vm, key, cb);
   }
}
function createWatcher(vm, key, cb, options = {}) {
    vm.$watch(key, cb, options);
}
export function initComputed(vm, computed) {
    let watchers = vm._computedWatcher = {};
    for (let key in computed) {
        let getterObj = computed[key];
        let getter = getterObj;
        if (typeof getterObj === 'object') {
            getter = getterObj.get;
        }
        // computed的key都创建一个watcher
        watchers[key] = new Watcher(vm, getter, () => {}, {lanzy: true});
        // 代理computed的key到vm上
        definedComputed(vm, key, getterObj);
    }
}
// computed 当依赖有更新时，才会去取值，否则取缓存 使用dirty判断，true重新取值
function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatcher[key];
        if (watcher.dirty) {
            watcher.evealue();
        }
        return watcher.value;
    }
}
function definedComputed(vm, key, getterObj) {
    let defindProxyObj = {};
    if (typeof getterObj === 'function') {
        defindProxyObj.get = createComputedGetter(key);
        defindProxyObj.set = () => { };
    } else {
        defindProxyObj.get = createComputedGetter(key);
        defindProxyObj.set = getterObj.set;
    };
    Object.defineProperty(vm, key, defindProxyObj);
}

