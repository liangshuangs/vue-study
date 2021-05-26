let id = 0;
export class Dep {
    constructor() {
        this.id = id++;
        this.watchers = [];
    }
    depend() {
        Dep.target.addDep(this);
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
export function pushTarget(watcher) {
    Dep.target = watcher;
}
export function popTarget() {
    Dep.target = null;
}