let callBack = [];
let waiting = false;

function flushCallback() {
    callBack.forEach(cb => cb());
    callBack = [];
    waiting = false;
}

export function nextTick(cb) {
    // 如果正在刷新，这个先等待，将cb 放入对列表中 等待上一轮刷新完成后，继续刷新下一轮的
    callBack.push(cb);
    if (!waiting) {
        setTimeout(flushCallback, 0);
        waiting = true;
    }
}