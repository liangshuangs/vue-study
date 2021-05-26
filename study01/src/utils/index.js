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
