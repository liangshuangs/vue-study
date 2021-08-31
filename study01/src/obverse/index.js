import { isObject } from '../utils';
import { arrayMethods } from './array';
import { Dep } from './dep';
class Obverse {
    constructor(data) {
        // 获取数组的值的时候，收集数组的依赖
        this.dep = new Dep();
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        } else {
            this.wark(data);
        }
    }
    observeArray(data) {
        data.forEach(item => {
            obverse(item)
        })
    }
    wark(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
        
    }
}
// arr: [1,2,3] key 为arr value= [1,2,3] childBo就是 return new Obverse(data);
 export function defineReactive(data, key, value) {
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
function deepArrary(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if (Array.isArray(current)) {
            deepArrary(current)
        }
    }
}
export function obverse(data) {
    if (!isObject(data)) {
        return;
    }
    if (data.__ob__) {
        return data.__ob__;
    }
    return new Obverse(data);
}
export function set(target, key, value) {
    if (Array.isArray(target)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, value);
        return val;
    }
    // 判断如果key本来就是对象中的一个属性，并且key不是Object原型上的属性。说明这个key本来就在对象上面已经定义过了的，直接修改值就可以了，可以自动触发响应。
    if (key in target && !(key in Object.prototype)) {
        target[key] = value;
        return value;
    }
    // 首先定义变量ob的值为 target.__ob__，这个__ob__属性到底是什么对象呢？vue给响应式对象都加了一个__ob__属性，如果一个对象有这个__ob__属性，那么就说明这个对象是响应式对象，我们修改对象已有属性的时候就会触发页面渲染。
    const ob = target.__ob__;
    if (!ob) {
        target[key] = value;
        return value;
    }
    // 这里其实才是vue.set()真正处理对象的地方。defineReactive(ob.value, key, val)的意思是给新加的属性添加依赖，以后再直接修改这个新的属性的时候就会触发页面渲染。

    // ob.dep.notice()这句代码的意思是触发当前的依赖（这里的依赖依然可以理解成渲染函数），所以页面就会进行重新渲染。
    defineReactive(target, key, value);
    ob.dep.notice();
    return value;

}