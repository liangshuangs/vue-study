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