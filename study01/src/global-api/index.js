import { mergeOptions } from '../utils';
import { initUse } from './use';
import { set } from '../obverse/index';
export function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options);
        return this;
    }
    /**
     * @description: 挂载全局组件
     * @param {*} id 组件ID
     * @param {*} opts 组件参数
     * @return {*} 返回一个构造函数
     */
    Vue.options._base = Vue;
    Vue.options.components = {}; // Vue options上所有的参数都会和vue实例的options合并 vm.$options = mergeOptions(vm.constructor.options, options);
    Vue.component = function (id, opts) {
        // 为保证每个组件的独立，每个组件必须是一个单独的实例 那么这个组件必须要继承Vue上的属性和方法
        Vue.options.components[id] = Vue.extend(opts);
    }
    Vue.extend = function (opts) {
        let Super = this;
        // 子组件的构造函数
        let Sub = function Vuecomponent(options) {
            // 继承了Vue上的_init方法，即初始化组件
            this._init(options);
        }
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, opts);
        return Sub;
    }
    Vue.set = set;
    initUse(Vue);
}