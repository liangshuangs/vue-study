/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-06-11 11:30:35
 * @LastEditTime: 2021-07-29 11:27:13
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
import {
    isReservedTag,
    isObject
} from '../utils';
export function patch(oldVnode, vnode) {
    // 如果是子组件渲染，没有el就没有oldVnode，直接返回真是dom就行，不要进行insertBefore到body上
    if (!oldVnode) {
        return createEl(vnode);
    }
    //nodeType= 1为真实的dom
    if (oldVnode.nodeType === 1) {
        let parentEle = oldVnode.parentElement;
        let newEl = createEl(vnode); // 将虚拟节点转成真是节点
        parentEle.insertBefore(newEl, oldVnode);
        parentEle.removeChild(oldVnode);
        return newEl;
    } else {
        let el = oldVnode.el;
        let newDom = createEl(vnode);
        el.parentElement.replaceChild(newDom, oldVnode.el);
        return;
        // let el = oldVnode.el;
        // let oldChildren = oldVnode.children || [];
        // let newChildren = vnode.children || [];
        // // diff 标签不一样，直接替换
        // if (oldVnode.tag === undefined) {
        //     if (oldVnode.text !== vnode.text) {
        //         el.textConent = vnode.text;
        //         return el;
        //     }
        // }
        // if (oldVnode.tag !== vnode.tag) {
        //     // oldVnode.el存放这真是的dom
        //     let newDom = createEl(vnode);
        //     el.parentElement.replaceChild(newDom, oldVnode.el);
        // } else if (oldChildren.length > 0 && newChildren.length > 0) {
        //     // 双方都有子节点 采用双指针的方法
        // } else if (oldChildren.length > 0) {
        //     // 老的节点有子节点 新的没有子节点
        //     el.innerHTML = '';


        // } else if (newChildren.length > 0) {
        //     // 新的有子节点，老的没有
        //     for (let i = 0; i < newChildren.length; i++) {
        //         let child = newChildren[i];
        //         el.appendChild(createEl(child));
        //     }
        // }
    }
}
// patch 属性
export function patchProps(vnode, oldPorps) {
    let props = vnode.data || {};
    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props[key]) {
                vnode.el.style[styleName] = props[key][styleName]
            }
        } else {
            vnode.el && vnode.el.setAttribute(key, props[key]);
        }
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
        return vnode(vm, tag, data, vm.key, children, undefined);
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
                let child = new Cotr({
                    isComponent: true
                }); // 挂载子组件，new Cotr就会执行_init()方法
                child.$mounted();
                vnode.instance = child.$el;
            }
        }
    };
    return vnode(vm, tag, data, key, undefined, undefined, {
        Cotr
    })
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text, Cotr) {
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
// 
/**
 * @description: 生成真是的节点
 * @param {*} vnode 虚拟dom
 * @return {*}
 */
export function createEl(vnode) {
    let {
        tag,
        data = {},
        children,
        text
    } = vnode;
    if (typeof tag === 'string') {
        if (createComponentEl(vnode)) {
            return vnode.instance;
        }
        vnode.el = document.createElement(tag);
        patchProps(vnode);
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