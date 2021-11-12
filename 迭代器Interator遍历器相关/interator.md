## 概念

### 什么是Interator?为什么需要Interator?


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

那么，部署了Interator的数据结构，体现在哪里呢？体现在给对象部署了Symbol.interator属性


举个例子


普通的对象是不能被for-of遍历的
```
let obj = { a: 'testa', b: 'testb' };
for (val of obj) {
    console.log(val)
}
```
会发生报错 TypeError: obj is not iterable


for of执行的时候，遍历器引擎会调用next方法

那如果我给boj部署了Interator接口呢?

```
// 部署Interator接口
let obj = {
    items: [1,2,3,4],
    [Symbol.iterator]: function () {
        let i = 0;
        let self = this;
        return {
            next() {
                let done = i >= self.items.length;
                let value = !done ? self.items[i++] + '自定义' : undefined;
                return {
                    done,
                    value
                }
            }
        }
    }
}
for (val of obj) {
    console.log(val) // 1自定义 2自定义 3自定义 4自定义
}

```
### es6中那那些数据类型默认部署了Interator接口
Array， String， Set， Map， arguments 类数组 DOM NodeList 对象


可以在控制台上输入任何一个字符串，点开可以看到对象或者原型链上有Symbol.Interator

### 有哪些操作会调用Symbol.interator方法呢？

- for of
- 结构赋值 let {a, b} = [1,2]
- 扩展运算符 [...arr]
- 作为数据源 Array.from(arr)

### for of中断

for of可以中断吗？答案是当然的，如果for of循环提前退出，则会自动调用return方法，返回一个对象
```
let obj = {
    items: [1,2,3,4],
    [Symbol.iterator]: function () {
        let i = 0;
        let self = this;
        return {
            next() {
                let done = i >= self.items.length;
                let value = !done ? self.items[i++] : undefined;
                return {
                    done,
                    value
                }
            },
            return() {
                console.log('提前退出');
                return {
                    done: true
                }
            }
        }
    }
}
for (val of obj) {
    console.log(val) // 1 2 提前退出
    if (val === 2) {
        break;
    }
}
```
抛出异常的方式退出，会先执行 return 方法再抛出异常。



