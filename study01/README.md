## rollup
1. npm install rollup rollup-plugin-node-resolve @babel/core @babel/preset-env rollup-plugin-babel
2.  npm run rollup

## vue 分析
1. 构造函数Vue
2. initMixin 给Vue的构造函数上添加功能，比如 _init();
  2.1 _init()  判断data

## 响应式原理
## 数据递归监控
## 处理render方法
## 模板编译
## 构造ast语法树
## 虚拟dom实现
## 虚拟dom创建真是dom  
## 异步响应原理
## 异步更新原理
## 数组更新原理  

### 每次调用数组的变异方法是，手动触发了notice
### 数组需要进行循环收集dep
1. vue 不要嵌套太深，否则会有大量递归
2. vue 对象通过defineProprey实现响应式，拦截了get 和set 如果不存在的属性，则不会被拦截也不会响应，可以使用$set 让对象自己去notice
3. vue 中的数组索引和长度发生变化，不会跟新视图

## watch实现原理
watch即是用户自己的watcher
判定options中是否有watch属性，有的话，则执行initWatch()方法
### initWatch 方法
其实就是new Watcher 实例一个watcher 为用户watcher
然后进行取值，取值则走了defineProxy属性的get拦截，则收集了watcher
当这个key发生变化的时候，则走了watcher的run方法，此时在run的方法里面，判定是否有this.user属性，标识是否是用户自己watcher，如果是的话，则走cb方法，就是watch里面的hander方法

## 计算属性实现原理
### 计算属性的特点：
1. 如果页面中没有使用到计算属性，则里面的方法是不会执行的，比如

```
<div id="app" style="color:red;background: gren;">
  <span class="ab">测试</span>
  {{firstName}}
</div>

computed: {
  fullName() {
    return this.firstName + this.lastName;
  }
}
```
在页面中并没有使用fullName，永远都不会执行funName();
2. 多次取值，如果依赖的值不变，就不会重新执行,依赖发生了才会重新执行funName();
3. computed的key 入fullName，不会进入数据劫持，因为页面对fullName进行取值时，走的是definedComputed()这个方法，详细见下文

### computed实现原理
计算属性其实也是一个watcher；
computed里的每个方法，都是一个watcher；
1. 判定options中是否有computed属性
2. 有这执行initComputed方法
```
Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        if (options.data) {
            initState(vm);
        }
        if (options.watch) {
            initWatch(vm, options.watch);
        }
        if (options.computed) {
            initComputed(vm, options.computed);
        }
        if (vm.$options.el) {
            vm.$mounted(vm.$options.el);
        }
}
```
3. 在initComputed方法中，主要是做了两件事，一是new Watcher一个实例，另外一件事是代理computed的key到vm上，这样就可以用vm.fullName直接取fullName的值了，就是definedComputed()
第一件事，实例化一个Watcher；
```
export function initComputed(vm, computed) {
    let watchers = vm._computedWatcher = {};
    for (let key in computed) {
        let getterObj = computed[key];
        let getter = getterObj;
        if (typeof getterObj === 'object') {
            getter = getterObj.get;
        }
        // computed的key都创建一个watcher
        watchers[key] = new Watcher(vm, getter, () => {}, {lanzy: true});
        // 代理computed的key到vm上
        definedComputed(vm, key, getterObj);
    }
}
```
传入了一个vm, getter就是computed里面的方法，比如fullName(); lanzy就是computed watcher;
并且建watcher存放到了vm中
```
function definedComputed(vm, key, getterObj) {
    let defindProxyObj = {};
    if (typeof getterObj === 'function') {
        defindProxyObj.get = createComputedGetter(key);
        defindProxyObj.set = () => { };
    } else {
        defindProxyObj.get = createComputedGetter(key);
        defindProxyObj.set = getterObj.set;
    };
    Object.defineProperty(vm, key, defindProxyObj);
}
```
当组件进行渲染时，就会对fullName 进行取值（页面中用到了fullName）；这样就执行了createComputedGetter的方法
```
// computed 当依赖有更新时，才会去取值，否则取缓存 使用dirty判断，true重新取值
function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatcher[key];
        if (watcher.dirty) {
            watcher.evealue();
        }
        return watcher.value;
    }
}
```
当对fullName取值是，执行的是computedGetter()，dirty用来做缓存用的，watcher.js中的evealue方法，就是执行了fullName这个方法，
```
// obverse/watcher.js
 // cmpunted更新
    evealue() {
        this.dirty = false;
        this.value = this.get();
    }
    get() {
        pushTarget(this);
        let value = this.getter.call(this.vm); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 
        popTarget();
        //stack 1:渲染watcher 2：computed watcher popTarget之后，Dep.target就是渲染watcher了
        if (Dep.target) {
            this.depend();
        }
        return value;
    }
```
对fullName取完值后，dirty设置为false，在看this.get()方法中，pushTarget(this);相对是给Dep.target赋值，因为这个是在watcher.evealue();中调用，所以这个this就是computed watcher,this.getter.call(this.vm)就是fullName()即 return this.firstName + this.lastName;那么这是对this.firstName进行了取值，取值的时候拦截了get方法，
```
Object.defineProperty(data, key, {
            get() {
                // 首次挂载时会调用render方法，则会调用vm上的值，触发get 则开始收集依赖
                if (Dep.target) {
                    dep.depend(); // 收集依赖
                    if (childBoj) {
                        childBoj.dep.depend(); // 收集数组依赖
                        if (Array.isArray(value)) {
                            deepArrary(value); // 递归收集数组的dep
                        }
                    }
                }
                return value;
            },
            set(newVal) {
                if (newVal !== value) {
                    obverse(newVal);
                    value = newVal;
                    dep.notice(); // 通知依赖更新
                } 
            }
        })
```
firstName 会实例一个dep（每个data上的属性都会有一个dep实例)，执行了dep.depend();
```
depend() {
        Dep.target.addDep(this); // watcher 里面记录dep实例
    }
```
Dep.target就是computed watcher，所以相对是执行了watcher的addDep方法，
```
addDep(dep) {
        let id = dep.id;
        if (!this.depIds.has(id)) {
            this.depIds.add(id);
            this.deps.push(dep); // this就是watcher,watcher有个属性deps
            dep.addWatcher(this); // dep 里面记录watcher实例
        }

    }
```
就是在dep添加了watcher，firstName的dep实例中添加了computed fullName 的 watcher，所以当firtName更新时，执行的是computed fullName 的 watcher的run,及getter,那么这个getter就是funllName()；但是页面没有更新，因为firstName的dep实例中没有收集渲染watcher，想要页面进行更新，则需要收集渲染watcher
如何实现呢？
```
Dep.target = null;
let stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
    console.log(watcher,'watcher')
}
export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}
```
把 watcher 存放到stack中，页面渲染的流程是：
页面开始渲染，实例化一个渲染watcher，执行对fullName进行取值，执行了watcher.js的get();Dep.target = 渲染watcher,执行了this.get，对fullName进行了取值，此时调用的是computed中fullName的watcher的evealue() 方法，即执行了this.get();根据谁调用，this指向谁，那么this就是computed中fullName的watcher，在调用this.get方法中，又对Dep.target进行了赋值，那么此时Dep.target = computed中fullName的watcher，
又对firstName 和lastName进行了取值，此时触发了get拦截，
```
defineReactive(data, key, value) {
        let childBoj = obverse(value);
        let dep = new Dep();
        Object.defineProperty(data, key, {
            get() {
                // 首次挂载时会调用render方法，则会调用vm上的值，触发get 则开始收集依赖
                if (Dep.target) {
                    dep.depend(); // 收集依赖
                    if (childBoj) {
                        childBoj.dep.depend(); // 收集数组依赖
                        if (Array.isArray(value)) {
                            deepArrary(value); // 递归收集数组的dep
                        }
                    }
                }
                return value;
            },
            set(newVal) {
                if (newVal !== value) {
                    obverse(newVal);
                    value = newVal;
                    dep.notice(); // 通知依赖更新
                } 
            }
        })
    }
```
执行firstName的dep.depend()方法，firstName的dep收集的是computed中fullName的watcher，对firstName取值完成后，
```
get() {
        pushTarget(this);
        let value = this.getter.call(this.vm); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 
        popTarget();
        //stack 1:渲染watcher 2：computed watcher popTarget之后，Dep.target就是渲染watcher了
        if (Dep.target) {
            this.depend();
        }
        return value;
    }
```
如果有Dep.target，此时Dep.target就是渲染watcher,执行this.depend();
```
depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend(); // watcher 里面记录dep实例
        }
    }
```
此时这个this就是computed watcher,里面存放的firstName和lastName的dep,dep里面执行depend，即把watcher就是渲染watcher存到了dep里面去了，当这个firstName更新时，就是执行dep里面的watcher，里面及有渲染watcher,那么页面就会更新了。













计算属性默认不执行，多次取值，如果依赖的值不变，就不会重新执行；依赖的值变化了，需要重新执行
dirty 表示这个值是不是脏的，默认是true，取完值后改为false,依赖值改变了再改变dirty为true
计算属性其实也是一个watcher
需要将computed的key挂载到vue实例上
























```
<div id="app" style="color:red;background: gren;">
  <span class="ab">测试</span>
  {{fullName}}
</div>

computed: {
  fullName() {
    return this.firstName + this.lastName;
  },
  // fullName: {
  //     get() {
  //         return this.firstName + this.lastName;
  //     },
  //     set(newVal) {
  //         console.log('new', newVal)
  //     }
  // }
}  

setTimeout(() => {
  vm.firstName = 'wang'
}, 3000)
```
fullName取值时，直接是去vm上的值，并没有进行属性监听，所以没有收集到渲染watcher
```
// 初始化计算属性
export function initComputed(vm, computed) {
    for (let key in computed) {
        console.log(key,'key')
        let userDef = computed[key];
        let getter = typeof userDef === 'function' ? userDef : userDef.get;
        // 创建一个watcher
        // new Watcher(this, getter, () => { }, { lanzy: true });
        // 将key挂载到vm上
        definedComputed(vm, key, userDef);
    }
}
function definedComputed(vm, key, userDef) {
    let sharedPropery = {};
    if (typeof userDef === 'function') {
        sharedPropery.get = userDef;
    } else {
        sharedPropery.get = userDef.get;
        sharedPropery.set = userDef.set;
    }
    Object.defineProperty(vm, key, sharedPropery);
}
```
computed里的每个key都有一个computed watcher;在new watcher的时候，执行了get方法，及对依赖值进行了取值，firstName，lastName，对这两个属性进行了取值，触发了get拦截，则收集了该watcher，但是这个watcher是computed watcher,不是渲染watcher，当firstName，lastName发生改变时，需要重新计算fullName，手机了该属性的computed watcher，则这个是没有问题的，但是页面却不会更新，因为没有收集到渲染watcher？
如何处理呢？
梳理下页面渲染逻辑：
1. 页面在进行渲染时，创建了渲染watcher，此时可以把此watcher保存到一个数组中，同时对fullName进行了取值，则会生成一个computed watcher,依赖属性也收集了该watcher，同时判定一下数组是否还有watcher，有则收集改watcher，

