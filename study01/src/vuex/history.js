import Vue from "../index";
import { forEach } from './util';
import ModuleCollection from './ModuleCollection';

function installModule(store, rootState, path, module) {
    let ns = store._modules.getNameSpace(path);
    /**
     * forEachGetter(cb)
     * forEach(this._raw.getters, cb)
     * export function forEach(obj, fn) {
            Object.keys(obj).forEach(key => {
                fn(obj[key], key);  // obj[key] =  myAge(state) {return state.age + 10}
            })
        }
     */
    module.forEachGetter((fn, key) => {
        // fn就是getters里面的方法
        store.wrapperGetters[ns + key] = function () {
            return fn.call(store, module.state);
        }
    });
    // child就是module
    module.forEachChildren((child, key) => {
        installModule(store, rootState, path.concat(key), child);
    })
}
class Store {
    constructor(options) {
        const { state, getters, mutations, actions } = options;
        this.getters = {};
        this._modules = new ModuleCollection(options);
        this.wrapperGetters = {};
        installModule(this, state, [], this._modules.root);
        const computed = {};
        //this.wrapperGetters = {'myAge': '--','index/myName': '--'}
        forEach(this.wrapperGetters, (getter, key) => {
            computed[key] = getter;
            // 当我们去getters上取值 需要对computed取值
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return this._vm[key];
                } // 具备了缓存的功能
            })
        })
        this.mutations = {};
        forEach(mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn.call(this, this.state, payload);
        })
        this.actions = {};
        forEach(actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this, payload);
        })
        /**
         * new Vue就会实例化一个vue,那么就会对data属性进行监听，当页面使用到data属性时,就会进行收集watcher
         * 这个watcher就是页面的渲染watcher
         * 当这个属性发生变化时，就是去执行watcher里面的更新方法
         */
        this._vm = new Vue({
            data: {
                $$state: state
            },
            computed
        });
    }
    // 类的属性访问器
    get state() { // this.$store.state => defineProperty中的get
        // 依赖于 vue的响应式原理
        return this._vm._data.$$state
    }
    commit(type, payload) {
        this.mutations[type](payload);
    }
    dispatch(type, payload) {
        this.actions[type](payload);
    }
}
export default Store;