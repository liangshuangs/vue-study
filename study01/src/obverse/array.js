let oldArrayMethods = Array.prototype;
export let arrayMethods = Object.create(oldArrayMethods);
let methods = ['push', 'shift', 'unshift', 'reverse', 'splice', 'sort', 'pop'];
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        oldArrayMethods[method].call(this, ...args);
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted);
        ob.dep.notice(); // 只要触发了函数的方法，就通知更新
    }
})