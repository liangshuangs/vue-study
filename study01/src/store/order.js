const order = {
    namespaced: true,
    state: {
        name: 'order 名称'
    },
    // 所有的getter 都会合并到gen上，注意不要同名了，免得被覆盖
    getters: {
        myOrderName(state) {
            return state.name
        }
    },
    mutations: {
        changeOrderName(state, payload) {
            state.name = payload;
        }
    },
    actions: {
        // 异步操作
        handleOrderName(vm, payload) {
            setTimeout(() => {
                vm.commit('order/changeOrderName', payload)
            },3000)
        }
    },
    modules: {
        subOrder: {
            namespaced: true,
            state: {
                name: 'suborder 名称'
            },
            getters: {
                mySubOrderName(state) {
                    return state.name
                }
            }
        }
    }
}
export default order;