## vue.use
1. 是用来使用插件的，可以在插件中扩招全局组件、指令、原型方法等。
2. 会调用插件的install方法
```
function install(Vue) {
    Vue.mixin({
        beforeCreate() {
            let options = this.$options;
            if (options.store) {
                this.$store = options.store;
            } else {
                // 先保证他是一个子组件，并且父亲上有$store
                if(this.$parent && this.$parent.$store){
                    this.$store = this.$parent.$store
                }
            };
        }
    })
};
export default install;
```
Vue.use的使用，如果插件中有install方法，则会调用install方法；次方法主要是调用了Vue的mixin方法；
```
Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options);
        return this;
    }
```
而Vue的mixin方法，就是合并options，将beforeCreate 和组件的beforeCreate进行合并，组件在实例化的时候，会执行beforeCreate这个生命周期，此时，就会把options.store挂载到this.$store上
```
<div id="app" style="color:red;background: gren;">
    <span class="ab">测试</span>
    {{message}} {{$store.state.age}}
</div>
```
html对$store.state取值，实际上就是取store上的值

src/main.js
```
import Vue from './index';
import store from './store';
let vm = new Vue({
    data: {
        message: 'hello---',
    },
    store,
    el: '#app'
});
console.log(vm,'vm')
```
将store传入到Vue中，那么，options就有了store

src/store/index.js
```
import Vue from '../index';
import Vuex from '../vuex';
Vue.use(Vuex);
let store = new Vuex.Store({
    state: {
        age: 12
    },
    getters: {
        myAge(state) {
            return state.age + 10
        }
    }
})
export default store;
```
store是Vuex的实例，里面有state
Store是一个类
```
import Vue from "../index";
import { forEach } from './util';

class Store {
    constructor(options) {
        const { state, getters, mutation, actions, module, strit } = options;
        /**
         * new Vue就会实例化一个vue,那么就会对data属性进行监听，当页面使用到data属性时,就会进行收集watcher
         * 这个watcher就是页面的渲染watcher
         * 当这个属性发生变化时，就是去执行watcher里面的更新方法
         */
        this._vm = new Vue({
            data: {
                $$state: state
            }
        });
    }
    // 类的属性访问器
    get state() { // this.$store.state => defineProperty中的get
        // 依赖于 vue的响应式原理
        return this._vm._data.$$state
    }
}
export default Store;
```
将state放到data上面，此时，state就会被watch,当取值this.$store.state，就会执行get state，就会执行his._vm._data.$$state
