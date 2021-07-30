export function initUse(Vue) {
    /**
     * plugin Function | Object
     * 要么是方法，要么是对象，并且有install方法
     */
    Vue.use = function (plugin) {
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        };
        const args = toArray(arguments, 1); // 删除最后一个入参
        args.unshift(this); // this 指向Vue 第一个参数就是Vue
        if (typeof plugin.install === 'function') {
            plugin.install.apply(this, args);
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args);
        };
        installedPlugins.push(plugin);
        return this;
    }
}
function toArray(list, start = 0) {
    let i = list.length - start;
    let res = new Array(i);
    while (i--) {
        res[i] = list[i - start];
    };
    return res;
}