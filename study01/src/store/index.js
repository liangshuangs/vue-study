import Vue from '../index';
// import Vuex from '../vuex';
import Vuex from '../vuex/index-module';
import Home from './home';
import Order from './order';
Vue.use(Vuex);
let store = new Vuex.Store({
    namespaced: true,
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
    },
    modules: {
        home: Home,
        order: Order
    }
})
export default store;