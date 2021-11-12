## 概念

什么是Interator?为什么需要Interator?


带着问题来看下下面的解释。


javascript表示集合的数据类型有：Array,Object,Set,Map;如果我要遍历这些数据，目前还没有统一的方法来处理，这是ES6增加了Interator，Interator的目的是为了不同的数据结构提供统一的数据访问机制；

Interator是一种接口，可以理解为一种特殊的对象-迭代器对象，任何数据结构只要部署了Interator接口，就可以被for of进行遍历。


迭代器对象有什么特点呢？


对象里面有一个next方法，内次调用next就会返回一个结果对象，对象有value和done属性，value是结果值，done是一个布尔值，表示遍历是否结束或者后面是否还有可用的数据。

```
function MyInterator(list) {
    let i = 0;
    return {
        next() {
            let done = i >= list.length;
            let value = !done ? list[i++] : undefined;
            return {
                value,
                done
            }
        }
    }
};
let interator = MyInterator([1, 2, 3]);
console.log(interator.next()); // { value: 1, done: false }
console.log(interator.next()); // { value: 2, done: false }
console.log(interator.next()); // { value: 3, done: false }
console.log(interator.next()); // { value: undefined, done: true }
```

