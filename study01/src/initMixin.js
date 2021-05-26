import { initState } from './initState';
import { complierToFunctions } from './complier';
import { mountComponent } from './lifecyle';
import { initWatch } from './stateMixin';
function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        if (options.data) {
            initState(vm);
        }
        if (options.watch) {
            initWatch(vm, options.watch);
        }
        if (vm.$options.el) {
            vm.$mounted(vm.$options.el);
        }
    }
    Vue.prototype.$mounted = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;
        if (!vm.$options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
                const render = complierToFunctions(template);  // 将模板编译成渲染函数
                vm.$options.render = render; 
            }
        }
        // 需要挂载这个组件 调用render 生成真是dom
        mountComponent(vm, el);
    }
};
export default initMixin;