import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './schedular';
let id = 0;
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm;
        this.updateFn = expOrFn; // 渲染及挂载真是dom
        this.cb = cb;
        this.user = !!options.user;
        this.options = options;
        if (typeof expOrFn === 'string') {
            this.getter = function () {
                return vm[expOrFn];
            }
        } else {
            this.getter = expOrFn; 
        }
        this.deps = [];
        this.depIds = new Set();
        this.id = id++;
        // 默认会渲染一次组件 因为第一次new组件时，需要挂载组件
        this.value = this.get(); // 第一次渲染的值 即 旧值
    }
    get() {
        pushTarget(this);
        let value = this.getter(); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 
        popTarget();
        return value;
    }
    update() {
        // 将更新放到 queueWatcher里的setTimerout执行 由于setTimerout是异步的，会先把同步先执行完（比如更改vm.data就是同步的操作），再执行异步的方法
        queueWatcher(this);
    }
    run() {
        // 更新时
        let newValue = this.get();
        let oldValue = this.value;
        this.value = newValue;
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depIds.has(id)) {
            this.depIds.add(id);
            this.deps.push(dep);
            dep.addWatcher(this);
        }

    }
}
// watcher dep 
/**
 * 在进行初始化取值的时候，会对每个数据添加一个属性，即dep属性，用来储存渲染watcher
 * 每个属性，可能对于多个视图
 */
export default Watcher;