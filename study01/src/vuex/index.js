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