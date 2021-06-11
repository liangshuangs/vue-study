/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-06-11 11:30:35
 * @LastEditTime: 2021-06-11 16:20:04
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
import { isReservedTag, isObject } from '../utils';
export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        return createEl(vnode);
    }
    if (oldVnode.nodeType === 1) {
        let parentEle = oldVnode.parentElement;
        let newEl = createEl(vnode); // 将虚拟节点转成真是节点
        parentEle.insertBefore(newEl, oldVnode);
        parentEle.removeChild(oldVnode);
        return newEl;
    }
}
/**
 * @description: 
 * @param {*} vm
 * @param {*} tag
 * @param {*} data
 * @param {array} children
 * @return {*}返回一个虚拟节点
 */
// return _c(
//     'div',
//     { id: "app", style: { "color": "red", "background": " gren" } },
//     _c('span', { class: "ab" }, _v('测试')),
//     _c('my-button', undefined)
// )
export function createElement(vm, tag, data = {}, ...children) {
    //return vnode(vm, tag, data,vm.key, children, undefined);
    // 是否是原生的标签
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data,vm.key, children, undefined);
    } else {
        //将保持在vm.$options.components的对应的组件取出来
        let subComponent = vm.$options.components[tag];
        // 此时这个my-button是通过Vue.component方法挂载的，所以这个subComponent就是一个子组件的构造函数
        return createComponent(vm, `vue-component-${tag}`, data, vm.key, subComponent);
    }
}
export function createComponent(vm, tag, data, key, Cotr) {
    // 如果是在组件里面通过  components: {'my-button': {template: `<buttton>world</button>`}}创建的子组件，则就是一个object
    // 需要将object变成一个构造函数
    if (isObject(Cotr)) {
        Cotr = vm.$options._base.extend(Cotr);
        data.hook = {
            init(vnode) {
                let child = new Cotr({isComponent: true}); // 挂载子组件，new Cotr就会执行_init()方法
                child.$mounted();
                vnode.instance = child.$el;
            }
        }
    };
    return vnode(vm, tag, data, key,undefined,undefined, {Cotr})   
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined,undefined, undefined, text);
}
function vnode(vm, tag, data, key, children, text,Cotr ) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        Cotr
    }
}
function createEl(vnode) {
    let { tag, data = {}, children,text } = vnode;
    if (typeof tag === 'string') {
        if(createComponentEl(vnode)) {
            return vnode.instance;
        }
        vnode.el = document.createElement(tag);
    } else {
        vnode.el = document.createTextNode(text);
    }
    children && children.forEach(child => {
        vnode.el.appendChild(createEl(child));
    });
    return vnode.el;
}
function createComponentEl(vnode) {
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode);
        return true;
    }
}