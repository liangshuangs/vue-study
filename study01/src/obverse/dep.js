let id = 0;
export class Dep {
    constructor() {
        this.id = id++;
        this.watchers = [];
    }
    depend() {
        Dep.target.addDep(this); // watcher 里面记录dep实例
    }
    addWatcher(watcher) {
        this.watchers.push(watcher);
    }
    notice() {
        this.watchers.forEach(watcher => {
            watcher.update();
        })
    }
}
Dep.target = null;
let stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
}
export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}