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
    },
    mutations: { // method  commit 同步更改状态
        changeAge(state, payload) {
            state.age += payload
        }
    },
    actions: {
        // 异步操作
        handleAge(vm, payload) {
            setTimeout(() => {
                vm.commit('changeAge', payload)
            },3000)
        }
    },
    modules: {
        index: {
            namespaced: true,
            state: {
                name: 'index'
            },
            getters: {
                myName(state) {
                    return state.name + '1'
                }
            },
            modules: {
                c: {
                    namespaced: true,
                    state: {
                        age: 100
                    },
                }
            }
        },
        home: {
            namespaced: true,
            state: {
                name: 'home'
            }
        }
    }
})
export default store;