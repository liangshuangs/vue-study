/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-06-11 11:30:35
 * @LastEditTime: 2021-06-11 17:34:22
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
import { patch, createElement, createTextElement } from './vdom/index';
import Watcher from './obverse/watcher';
export function lifecyleMixin(Vue) {
    Vue.prototype._c = function () {
        return createElement(this, ...arguments)
    }
    Vue.prototype._v = function (text) {
        return createTextElement(this, text);
    }
    Vue.prototype._s = function (val) {
        return JSON.stringify(val);
    }
    Vue.prototype._update = function (vnode, update) {
        let vm = this;
        if (update) {
            vm.$el = patch(vm.oldNode, vnode);
        } else {
            vm.$el = patch(vm.$el, vnode);
        }
    }
}
// 每次每一个组件渲染就会创建一个watcher的实例
export function mountComponent(vm) {
    let updateComponent = function (update) {
        vm._update(vm._render(), update);
    }
    // 挂载前
    //updateComponent();
    //挂载后
    // 观察者模式： 属性：“被观察者” 刷新页面：“观察者”
    // vm updateComponent：渲染函数，cb options
    new Watcher(vm, updateComponent, () => { }, {}); // 每个组件渲染，都会创建一个对应的watcher,多个组件渲染就会创建多个watcher 
}
export function callHook(vm, hook) {
    let handlers = vm.$options[hook];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
    }
}