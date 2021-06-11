<!--
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-06-11 11:34:08
 * @LastEditTime: 2021-06-11 16:35:08
 * @LastEditors: Please set LastEditors
 * @Reference: 
-->
# vue-component
Vue.component是挂载全局组件 写到global-api中
```
Vue.options._base = Vue;
    Vue.options.components = {}; // Vue options上所有的参数都会和vue实例的options合并 vm.$options = mergeOptions(vm.constructor.options, options);
    Vue.component = function (id, opts) {
        // 为保证每个组件的独立，每个组件必须是一个单独的实例 那么这个组件必须要继承Vue上的属性和方法
        Vue.options.components[id] = Vue.extend(opts);
    }
    Vue.extend = function (opts) {
        let Super = this;
        // 子组件的构造函数
        let Sub = function Vuecomponent(options) {
            // 继承了Vue上的_init方法，即初始化组件
            this._init(options);
        }
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, opts);
        return Sub;
    }
```
用法：
```
Vue.component('my-button', {
    template: `<button>hello</button>`
})
```
思路：入参1是组件的名称，入参2是组件的参数，将组件存放在Vue.options.components中，存放到components的是一个构造函数，为什么是一个构造函数呢，因为组件必须是一个隔离的作用域，所以最好每个组件都是一个实例；因为这个构造函数基础了Vue,所以具备了Vue的所有属性和参数，在new这个构造函数的时候，就会执行_init()方法，就是Vue.init();而这个方法就是渲染组件的方法


在Vue.prototype._init方法里面，有这个操作vm.$options = mergeOptions(vm.constructor.options, options);就是将参数进行合并，由于组件都是集成了Vue，所以vm.constructor就是Vue,全局挂载的组件放在Vue.options.components，所以就会将全局的components挂载到当前的实例上

组件合并的思路是怎么样的？
如果局部组件和全局组件重名，如何处理呢？比如
```
components: {
                'my-button': {
                    template: `<button>world</button>`
                }
            }
```
组件的合并思路是：局部组件的__prop__是全局组件，比如在当前的components找不到my-button，就会沿着__prop__，那么就会找到全局组件，所以，如果局部组件和全局组件同名，就会优先使用局部组件
```
strats.components = function (parentVal, childVal) {
    let options = Object.create(parentVal);
    for (let key in childVal) {
        options[key] = childVal[key];
    }
    return options;
}
```

那怎么样渲染全局组件呢？
组件进行挂载的时候，第一步是根据template生成render方法，render方法生成虚拟dom,patch将虚拟dom转化成真是dom,并挂载在body上
```
_c(
    'div', 
    {id: "app",style: {"color":"red","background":" gren"}},
    _c('span', {class: "ab"},_v('测试')),
    _c('my-button', undefined)
)
_c(tag, data,...children) 
参数1是tag,参数2是属性集合，参数...都是children
```
可见，_c('my-button', undefined)是一个组件，不能直接将其进行渲染，我们应该渲染的是组件的template,那么需要对此进行判断，
_c方法，就是createElement
```
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
                console.log(child.$el,'child')
            }
        }
    };
    return vnode(vm, tag, data, key,undefined,undefined, {Cotr})   
}
```
思路就是：如果不是原生的标签，那么就是组件，需要对组件进行加强处理，如果是组件，在data上增加一个hook方法
然后返回vnode()就是一个虚拟节点，最终的虚拟节点是：
```
Cotr: undefined
children: Array(2)
0: {vm: Vue, tag: "span", data: {…}, key: undefined, children: Array(1), …}
1: {vm: Vue, tag: "vue-component-my-button", data: {…}, key: undefined, children: undefined, …}
length: 2
__proto__: Array(0)
data: {id: "app", style: {…}}
el: div
key: undefined
tag: "div"
text: undefined
vm: Vue {$options: {…}, _data: {…}, $el: div}
```
组件在进行挂载的时候，调用的patch方法，
```
 Vue.prototype._update = function (vnode) {
        let vm = this;
        vm.$el = patch(vm.$el, vnode);
    }

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
```
思路：patch核心的方法是：createEl,createEl的入参是一个虚拟节点，根据tag生成一个标签，然后将children遍历，子元素也调用createEl
createEl的入参如下：
```
Cotr: undefined
children: Array(2)
0: {vm: Vue, tag: "span", data: {…}, key: undefined, children: Array(1), …}
1: {vm: Vue, tag: "vue-component-my-button", data: {…}, key: undefined, children: undefined, …}
length: 2
__proto__: Array(0)
data: {id: "app", style: {…}}
el: div
key: undefined
tag: "div"
text: undefined
vm: Vue {$options: {…}, _data: {…}, $el: div}
```
在执行到tag=string需要进行特殊处理， createComponentEl(vnode),如果是组件，返回true，执行里面的逻辑，

```
function createComponentEl(vnode) {
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode);
        return true;
    }
}
```
vnode里面有init方法，那说明是组件，执行里面的init方法，就是执行
```
data.hook = {
            init(vnode) {
                let vm = new Cotr({isComponent: true}); // 挂载子组件，new Cotr就会执行_init()方法
                vm.$mounted();
                vnode.instance = vm.$el;
            }
        }
```
就是实例化一个Cotr，Cotr来源于vm.$options.components[tag]，也就是一个构造函数，实例化就会执行init方法，就是Vue._init()方法
在_init方法有如下判断：
```
if (vm.$options.el) {
            vm.$mounted(vm.$options.el);
        }
```
此时，因为子组件没有el,所以不会执行挂载，需要手动执行vm.$mounted();进行，重复上面的挂载流程，生成了真是dom,存放在了vm.$el上，子组件的真是还赋值给了vnode.instance，所以如果是组件渲染，返回的是vnode.instance
