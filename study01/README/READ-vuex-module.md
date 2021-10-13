## vuex 实现模块化
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app" style="color:red;background: gren;">
        <span class="ab">测试</span>
        模块home名称：{{$store.state.home.name}}
        <div>
        <div>
        模块order名称：{{$store.state.order.name}}
        </div>
        <div>
        模块 sub order名称：{{$store.state.order.subOrder.name}}
        </div>
        <div>
            通过getter获取名称：{{$store.getters['order/subOrder/mySubOrderName']}}
        </div>

        通过getter获取名称：{{$store.getters['order/myOrderName']}}
        </div>
        <div>
            <button id="name">修改模块home名称</button>
        </div>
        <div>
            <button id="name1">异步修改名称</button>
        </div>
    </div>
    <script src="dist/bundle.js"></script>
    <script>
        let vm = Vue.vm;
        let nameDom = document.getElementById('name');
        nameDom.addEventListener('click', () => {
            vm.$store.commit('order/changeOrderName', '模块order 名字改为 new order')
        }, false);
        let name1Dom = document.getElementById('name1');
        name1Dom.addEventListener('click', () => {
            vm.$store.dispatch('order/handleOrderName', '我异步修改 order 名字')
        }, false);
    </script>
</body>

</html>
```
模块化的思路：
```
class Store {
    constructor(options) {
        const { state } = options;
        // 需要对用户的模块进行整合
        this._modules = new StoreModules(options);
        const computed = {};
        this.getters = {};
        this.wrapperGetter = {};
        this.mutations = {};
        this.actions = {};
         // 将所有的 mutations actions都挂载到this 上
        installModule(this, state, [], this._modules.root);
        forEach(this.wrapperGetter, (getter, key) => {
            computed[key] = getter;
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
        })
        // 这里new 了一个vue的实例，当这个实例的data被取值时，就会收集对应的渲染watcher,这样数据更新时，视图就会更新
        this._vm = new Vue({
            data: {
                $$state: state
            },
            computed
        })
    }
    // 当对state进行取值时，比如store.state 其实就是取this._vm.data.$$state的值，
    get state() {
        return this._vm._data.$$state;
    }
    commit(type, payload) {
        this.mutations[type] && this.mutations[type].forEach(fn => fn(payload));
    }
    dispatch(type, payload) {
        this.actions[type] && this.actions[type].forEach(fn => fn(payload))
    }
}
```
第一步：实例化一个new StoreModules就是将数据初始化
数据变成下列结构
```
this.root = {
    _row: 用户定义的模块,
    state: 用户自己的state,
    _children: {
        home: {

        },
        order: {
            _children: {
                subOrder: {
                    
                }
            }
        }
    }

}
```
第二步：installModule将state、getter、action、 mutations挂载到this上面去
处理state path.length > 0表示不是根 Vue.set新增属性进行监听
```
[order, subOrder] 
if (path.length) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current];
        }, rootState);
        let key = path[path.length - 1];
        // vue新增属性，不是响应式
        if (parent) {
            Vue.set(parent, key, module.state);
        }
    }
```