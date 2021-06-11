export function isFunction(object) {
    return typeof object === 'function';
};
export function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
};
export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key];
        },
        set(newValue) {
            vm[data][key] = newValue;
        }
    })
}
let strats = [];
let lifeCylesHooks = ['beforeCreate', 'created', 'beforeMounted', 'mounted'];
lifeCylesHooks.forEach(hook => {
    strats[hook] = mergeCyles
})
strats.components = function (parentVal, childVal) {
    let options = Object.create(parentVal);
    for (let key in childVal) {
        options[key] = childVal[key];
    }
    return options;
}
export function mergeCyles(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        } else {
            return [childVal];
        }
    } else {
        return parentVal;
    }
}
let i = 0
export function mergeOptions(parent, child) {
    let options = {};
    for (let key in parent) {
        mergeFild(key);
    }
    for (let key in child) {
        if (parent.hasOwnProperty(key)) {
            continue;
        }
        mergeFild(key);
    }
    function mergeFild(key) {
        let parentVal = parent[key];
        let childVal = child[key];
        if (strats[key]) {
            options[key] = strats[key](parentVal, childVal);
        } else {
            if (isObject(parentVal) && isObject(childVal)) {
                options[key] = { ...parentVal, ...childVal };
            } else {
                options[key] = childVal || parentVal;
            }
        }
    }
    return options;
    // 策略模式
}
export function isReservedTag(tag) {
    let reservedTag = 'span,div,button,i,ul,li,a';
    return reservedTag.includes(tag);
}
