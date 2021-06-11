<!--
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-06-11 11:34:08
 * @LastEditTime: 2021-06-11 11:45:09
 * @LastEditors: Please set LastEditors
 * @Reference: 
-->
# vue-component
Vue.component是挂载全局组件 写到global-api中
```
Vue.options._base = Vue;
    Vue.options.components = {}; // Vue options上所有的参数都会和vue实例的options合并 vm.$options = mergeOptions(vm.constructor.options, options);
    Vue.component = function (id, opts) {
        // 为保证每个组件的独立，每个组件必须是一个单独的实例 那么这个组件必须要继承Vue上的属性和方法
        Vue.options.components[id] = opts;
    }
    Vue.extend = function (opts) {
        let Super = this;
        // 子组件的构造函数
        let Sub = function Vuecomponent() {
            // 继承了Vue上的_init方法，即初始化组件
            this._init();
        }
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, opts);
        return Sub;
    }
```