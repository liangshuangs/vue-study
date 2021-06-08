# 生命周期
生命周期可以使用Vue.mixin({});
```
Vue.mixin({
    beforeCreate() {
        console.log('beforeCreate-1')
    }
})
```
会在Vue上面有一个mixin的方法，这个方法会在全局有给对象，挂载一下全局的方法或者属性
```
export function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options);
        return this
    }
}
```
将options进行合并，不同的属性值有不同的合并策略
生命周期的合并策略是存放到一个数组中，
然后组件的生命周期，会和Vue.options的属性进行合并
```
Vue.prototype._init = function (options) {
    const vm = this;

    vm.$options = mergeOptions(vm.constructor.options, options);
}
```
这样就行Vue.mixin的属性合并到了vm上面了，然后再适当的时机触发这些钩子
钩子函数的触发
```
export function callHook(vm, hook) {
    let handlers = vm.$options[hook];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
    }
}
```
```
vm.$options = mergeOptions(vm.constructor.options, options);
// 创建之前
callHook(vm, 'beforeCreate');
```