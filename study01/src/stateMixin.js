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

