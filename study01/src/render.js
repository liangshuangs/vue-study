function renderMixin(Vue) {
    Vue.prototype._render = function () {
        let vm = this;
        let render = vm.$options.render;
        let vnode = render.call(vm);
        return vnode;
    }
};
export default renderMixin;