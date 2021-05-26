export function patch(oldVnode, vnode) {
    if (oldVnode.nodeType === 1) {
        let parentEle = oldVnode.parentElement;
        let newEl = createEl(vnode);
        parentEle.insertBefore(newEl, oldVnode);
        parentEle.removeChild(oldVnode);
        return newEl;
    }
}
export function createElement(vm, tag, data = {}, ...children) {
    return vnode(vm, tag, data,vm.key, children, undefined);
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined,undefined, undefined, text);
}
function vnode(vm, tag, data, key, children, text ) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text
    }
}
function createEl(vnode) {
    let { tag, data = {}, children,text } = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
    } else {
        vnode.el = document.createTextNode(text);
    }
    children && children.forEach(child => {
        vnode.el.appendChild(createEl(child));
    });
    return vnode.el;
}