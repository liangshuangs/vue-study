import { nextTick } from '../utils/next-tick';
let has = {};
let queue = [];
export function flushSchedularQueue() {
    queue.forEach(watcher => watcher.run());
    has = {};
    queue = [];
}
export function queueWatcher(watcher) {
    let id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        queue.push(watcher);
        nextTick(flushSchedularQueue);
    }
}