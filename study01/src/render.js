/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-05-12 11:35:35
 * @LastEditTime: 2021-06-11 18:45:55
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
function renderMixin(Vue) {
    Vue.prototype._render = function () {
        let vm = this;
        let render = vm.$options.render;
        let vnode = render.call(vm);
        vm.Node = vnode;
        return vnode;
    }
};
export default renderMixin;