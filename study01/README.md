## rollup
1. npm install rollup rollup-plugin-node-resolve @babel/core @babel/preset-env rollup-plugin-babel
2.  npm run rollup

## vue 分析
1. 构造函数Vue
2. initMixin 给Vue的构造函数上添加功能，比如 _init();
  2.1 _init()  判断data

## 响应式原理
## 数据递归监控
## 处理render方法
## 模板编译
## 构造ast语法树
## 虚拟dom实现
## 虚拟dom创建真是dom  
## 异步响应原理
## 异步更新原理
## 数组更新原理  

### 每次调用数组的变异方法是，手动触发了notice
### 数组需要进行循环收集dep
1. vue 不要嵌套太深，否则会有大量递归
2. vue 对象通过defineProprey实现响应式，拦截了get 和set 如果不存在的属性，则不会被拦截也不会响应，可以使用$set 让对象自己去notice
3. vue 中的数组索引和长度发生变化，不会跟新视图

## watch实现原理
watch即是用户自己的watcher
判定options中是否有watch属性，有的话，则执行initWatch()方法
### initWatch 方法
其实就是new Watcher 实例一个watcher 为用户watcher
然后进行取值，取值则走了defineProxy属性的get拦截，则收集了watcher
当这个key发生变化的时候，则走了watcher的run方法，此时在run的方法里面，判定是否有this.user属性，标识是否是用户自己watcher，如果是的话，则走cb方法，就是watch里面的hander方法

