import Vue from '../index';
import { forEach } from './util';
import StoreModules from './store';

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

function installModule(store, rootState, path, module) {
    // 将模块state挂载到根的state上 [home] [order] [order, subOrder]
    let ns = store._modules.getNameSpaces(path);
    if (path.length) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current];
        }, rootState);
        let key = path[path.length - 1];
        // vue新增属性，不是响应式
        if (parent) {
            Vue.set(parent, key, module.state);
        }
    }
    // 将getter 加载到this.getter上
    module.forEacthGetter((fn, key) => {
        store.wrapperGetter[ns + key] = () => {
            return fn.call(store, module.state)
        }
    })
    module.forEacthMutations((fn, key) => {
        store.mutations[ns + key] = store.mutations[ns + key] || []; // 模块化这里是一个数组
        store.mutations[ns + key].push((payload) => {
            return fn.call(store, module.state, payload)
        })
    })
    module.forEacthAction((fn, key) => {
        store.actions[ns + key] = store.actions[ns + key] || [];
        store.actions[ns + key].push((payload) => {
            return fn.call(store, store, payload)
        })
    })
    module.forEacthChildren((childModule, key) => {
        //console.log(childModule, key)
        installModule(store, rootState, path.concat(key), childModule)
    })

}
class Store {
    constructor(options) {
        const { state } = options;
        // 需要对用户的模块进行整合
        this._modules = new StoreModules(options);
        const computed = {};
        this.getters = {};
        this.wrapperGetter = {};
        this.mutations = {};
        this.actions = {};
         // 将所有的 mutations actions都挂载到this 上
        installModule(this, state, [], this._modules.root);
        forEach(this.wrapperGetter, (getter, key) => {
            computed[key] = getter;
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
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
        this.mutations[type] && this.mutations[type].forEach(fn => fn(payload));
    }
    dispatch(type, payload) {
        this.actions[type] && this.actions[type].forEach(fn => fn(payload))
    }
}
export default {
    install,
    Store
}