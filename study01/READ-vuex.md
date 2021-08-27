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
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app" style="color:red;background: gren;">
        <span class="ab">测试</span>
        名称：{{$store.state.name}}
        <div>
        通过getter获取名称：{{$store.getters.myName}}
        </div>
        <div>
            <button id="name">修改名称</button>
        </div>
        <div>
            <button id="name1">异步修改名称</button>
        </div>
    </div>
    <script src="dist/bundle.js"></script>
    <script>
        let vm = Vue.vm;
        let nameDom = document.getElementById('name');
        nameDom.addEventListener('click', () => {
            vm.$store.commit('changeName', '我由小明改成晓东')
        }, false);
        let name1Dom = document.getElementById('name1');
        name1Dom.addEventListener('click', () => {
            vm.$store.dispatch('handleName', '我异步修改名字拉')
        }, false);
    </script>
</body>

</html>
```

src/main.js
```
import Vue from './index';
import store from './store';
export const vm = new Vue({
    data: {
        message: 'hello',
    },
    store,
    el: '#app'
});
```
将store传入到Vue中，那么，options就有了store

src/store/index.js
```
import Vue from '../index';
import Vuex from '../vuex';
Vue.use(Vuex);
let store = new Vuex.Store({
    state: {
        name: '我是小明'
    },
    getters: {
        myName(state) {
            return state.name
        }
    },
    mutations: { // method  commit 同步更改状态
        changeName(state, payload) {
            state.name = payload
        }
    },
    actions: {
        // 异步操作
        handleName(vm, payload) {
            setTimeout(() => {
                vm.commit('changeName', payload)
            },3000)
        }
    }
})
export default store;
```
store是Vuex的实例，里面有state
Store是一个类
```
import Vue from '../index';
import { forEach } from './util';
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
class Store {
    constructor(options) {
        const { state, getters, mutations, actions } = options;
        const computed = {};
        this.getters = {};
        this.mutations = {};
        this.actions = {};
        // 通过$store.getters.myName获取数据，可以将getters的每一项挂载在computed上
        forEach(getters, (fn, key) => {
            computed[key] = () => {
                return fn(this.state)
            }
            // $store.getters[key]就是获取this._vm[key]因为上一步把key挂载在了computed上
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
        })
        forEach(mutations, (fn, key) => {
            this.mutations[key] = (payload) => {
                fn.call(this, this.state, payload);
            }
        })
        forEach(actions, (fn, key) => {
            this.actions[key] = (payload) => {
                fn.call(this, this, payload);
            }
        })
        // 这里new 了一个vue的实例，当这个实例的data被取值时，就会收集对应的渲染watcher,这样数据更新时，视图就会更新
        this._vm = new Vue({
            data: {
                $$state: state
            },
            computed
        })
    }
    // 当对state进行取值时，比如store.state 其实就是取this._vm.data.$$state的值，
    get state() {
        return this._vm._data.$$state;
    }
    commit(type, payload) {
        this.mutations[type](payload);
    }
    dispatch(type, payload) {
        this.actions[type](payload);
    }
}
export default {
    install,
    Store
}
```

