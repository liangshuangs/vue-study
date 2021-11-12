// function MyInterator(list) {
//     let i = 0;
//     return {
//         next() {
//             let done = i >= list.length;
//             let value = !done ? list[i++] : undefined;
//             return {
//                 value,
//                 done
//             }
//         }
//     }
// };
// let interator = MyInterator([1, 2, 3]);
// console.log(interator.next()); // { value: 1, done: false }
// console.log(interator.next()); // { value: 2, done: false }
// console.log(interator.next()); // { value: 3, done: false }
// console.log(interator.next()); // { value: undefined, done: true }

// 普通对象for of 遍历
// let obj = { a: 'testa', b: 'testb' };
// for (val of obj) {
//     console.log(val)
// }

// 部署Interator接口
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
// for (val of obj) {
//     console.log(val) // 1自定义 2自定义 3自定义 4自定义
// }
for (val of obj) {
    console.log(val) // 1自定义
    if (val === 2) {
        break;
    }
}
