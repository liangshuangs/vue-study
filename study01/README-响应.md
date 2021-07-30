## vue 如何实现响应的
第一步：new Vue执行了什么？
1. 执行了 this._init(options);
_init(options)做了什么？
第一：合并options
第二：执行beforeCreate钩子
第三：监听dada即obverse(data)，即对data里面的数据进来拦截
第四：执行created钩子
第五：initWatch，initComputed进行处理
第六：vm.$mounted(vm.$options.el);挂载组件
1. 挂载组价的时候，将获取的html转译为虚拟dom,再将虚拟dom，转为render方法，render方法就是将虚拟dom转为真是dom
2. mountComponent(vm, el)就是挂载组件，这个方法里面其实是实例化一个watcher
```
export function mountComponent(vm) {
    let updateComponent = function (update) {
        vm._update(vm._render(), update);
    }
    //挂载后
    // 观察者模式： 属性：“被观察者” 刷新页面：“观察者”
    // vm updateComponent：渲染函数，cb options
    new Watcher(vm, updateComponent, () => { }, {}); // 每个组件渲染，都会创建一个对应的watcher,多个组件渲染就会创建多个watcher 
}
```
当vm._render()执行时（将虚拟dom转为真是dom），如果页面第一次渲染，就会执行watcher里面的get方法
```
get(upate) {
        pushTarget(this); // Dep.target = this this 就是watcher实例
        let value = this.getter.call(this.vm, upate); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 
        popTarget();
        //stack 1:渲染watcher 2：computed watcher popTarget之后，Dep.target就是渲染watcher了
        if (Dep.target) {
            this.depend();
        }
        return value;
    }
```
那么就会对data的属性值进行取值，取值就会走到第三步，走到data的拦截器，
```
Dep.target.addDep(this); // watcher 里面记录dep实例
```
由于在watcher里面的get方法，pushTarget方法，那么Dep.target = watcher，那么Dep.target.addDep(this); 实际执行的是watcher里面的addDep方法，addDep(this)的this就是dep,那么就将当前的dep收集起来了
appDep方法
```
addDep(dep) {
        let id = dep.id;
        if (!this.depIds.has(id)) {
            this.depIds.add(id);
            this.deps.push(dep);
            dep.addWatcher(this); // dep 里面记录watcher实例
        }

    }
```
```
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
```
dep.depend();  收集依赖
当属性变化时，触发set方法，就会去执行更新dom的方法 dep.notice(); // 通知依赖更新
```
notice() {
        this.watchers.forEach(watcher => {
            watcher.update();
        })
    }
```
由于在addDep方法里面收集了watcher,dep.addWatcher(this);更新的时候，就会this.watchers进行遍历，执行watcher.update();update会执行run方法，run重新执行get(update)方法，get方法里面执行了this.getter，this.getter的就是new Watcher(vm, updateComponent, () => { }, {});的updateComponent，就是更新组件
