// 回调函数
// const fs = require('fs');
// fs.readFile('生成器相关/test.txt', 'utf-8', function (err, data) {
//     if (err) {
//         throw err;
//     }
//     console.log(data, 'data');
// })


// promise
// const readFile = require('fs-readfile-promise');
// readFile('生成器相关/test.txt').then(res => {
//     console.log('r',res.toString())
// })


// generator 函数
// const readFile = require('fs-readfile-promise');
// function* gen(){
//   var result = yield readFile('生成器相关/test.txt');
// }
// let res = gen();
// res.next().value.then(res => {
//     console.log('res', res)
// });

// var Thunk = function (fileName) {
//     return function (callback) {
//       return fs.readFile(fileName, callback);
//     };
//   };
  
//   var readFileThunk = Thunk(fileName);
//   readFileThunk(callback);

// Thunkify 模块

// var thunkify = require('thunkify');
// var fs = require('fs');

// var read = thunkify(fs.readFile);
// read('生成器相关/test.txt')(function(err, str){
//   console.log(str,'res')
// });

// 自动执行
// let thunkify = require('thunkify');
// let fs = require('fs');
// const readFile = thunkify(fs.readFile); // 这里返回的是一个方法，接收文件路径

// function* gen() {
//     const fs1 = yield readFile('生成器相关/test.txt'); // 返回一个方法，接收callback回调函数
//     console.log(fs1, 'fs1');
//     const fs2 = yield readFile('生成器相关/package.json');
//     console.log(fs2, 'fs2');
// }
// let g = gen();
// let res = g.next();
// console.log(res,'res1')
// res.value((err,data) => {
//     console.log('res2', data)
//     g.next(data);
// })



// let thunkify = require('thunkify');
// let fs = require('fs');
// const readFile = thunkify(fs.readFile); // 这里返回的是一个方法，接收文件路径
// function* gen() {
//     const fs1 = yield readFile('生成器相关/test.txt');
//     console.log(fs1,'fs1')
//     const fs2 = yield readFile('生成器相关/package.json');
//     console.log(fs2,'fs2')
// }
// function run(g) {
//     let gen = g();
//     function next(err, data) {
//         let res = gen.next(data);
//         if (!res.done) {
//             res.value(next)
//         }
//     };
//     next();
// }
// run(gen);
let arr = ['a', 'b', 'c'];
// for (let i = 0; i < arr.length; i++) {
//     console.log(arr[i]); // a, b, c
// }
// arr.forEach((item, index) => {
//     console.log(item, index); // a 0 b 1 c 2
// })
// for (let item in arr) {
//     console.log(item,'item') // 0, 1, 2
// }
arr[Symbol.iterator] = function () {
    let i = 0;
    let self = this;
    return {
        next: function() {
            let done = i >= self.length;
            let value = !done ? self[i++] + '3': undefined;
            return {value, done}
        }
    }
}
let [a, b] = arr;
console.log(a, b)


