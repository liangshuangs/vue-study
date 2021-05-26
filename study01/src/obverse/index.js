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
            this.defineReactive(data, key, data[key]);
        })
        
    }

    // arr: [1,2,3] key 为arr value= [1,2,3] childBo就是 return new Obverse(data);
    defineReactive(data, key, value) {
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