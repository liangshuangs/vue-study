## generator函数（生成器函数）的异步应用

处理异步编程的方法：
- 回调函数
- 事件监听
- 发布/订阅
- Promise对象


### 回调函数
例如读取文件内容，readFile的第三个参数就是回调函数；


这里还有一个知识点，为啥回调函数把err作为一个参数呢？


因为这是一个异步函数，执行是分段执行的，第一段（就是同步）执行完成后，任务所在的上下文环境已经结束了，回调函数是在第二段执行的，在这之后抛出的错误，原来的上下文环境已经无法捕获了，只能当做参数传入到第二段了；
```
const fs = require('fs');
fs.readFile('生成器相关/test.txt', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }
    console.log(data, 'data');
})
```

### Promise
```
// promise
const readFile = require('fs-readfile-promise');
readFile('生成器相关/test.txt').then(res => {
    console.log('r',res.toString())
})
```
### generator函数
generator函数封装的异步方法的问题在于何时调用第一阶段，何时执行第二阶段
```
// generator 函数
const readFile = require('fs-readfile-promise');
function* gen(){
  var result = yield readFile('生成器相关/test.txt');
}
let res = gen();
res.next().value.then(res => {
    console.log('res', res)
});
```

### thunk函数，自动执行generator函数的一种方法

```
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```
上面代码中，fs模块的readFile方法是一个多参数函数，两个参数分别为文件名和回调函数。经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。

```
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('生成器相关/test.txt')(function(err, str){
  console.log(str,'res')
});
```

generator函数如何自动执行？
```
let thunkify = require('thunkify');
let fs = require('fs');
const readFile = thunkify(fs.readFile); // 这里返回的是一个方法，接收文件路径

function* gen() {
    const fs1 = yield readFile('生成器相关/test.txt'); // 返回一个方法，接收callback回调函数
    console.log(fs1, 'fs1');
    const fs2 = yield readFile('生成器相关/package.json');
    console.log(fs2, 'fs2');
}
let g = gen();
let res = g.next();
console.log(res,'res1')
res.value((err,data) => {
    console.log('res2', data)
    g.next(data);
})
```
这段代码就是将回调函数，反复的传递给next()返回对象的value()中

```
let thunkify = require('thunkify');
let fs = require('fs');
const readFile = thunkify(fs.readFile); // 这里返回的是一个方法，接收文件路径
function* gen() {
    const fs1 = yield readFile('生成器相关/test.txt');
    console.log(fs1,'fs1')
    const fs2 = yield readFile('生成器相关/package.json');
    console.log(fs2,'fs2')
}
function run(g) {
    let gen = g();
    function next(err, data) {
        let res = gen.next(data);
        if (!res.done) {
            res.value(next)
        }
    };
    next();
}
run(gen);
```
这样不管有多少个异步函数，只要执行了run,就会自动执行里面的异步函数
