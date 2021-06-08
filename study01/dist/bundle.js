(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function isFunction(object) {
    return typeof object === 'function';
  }
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  var strats = [];
  var lifeCylesHooks = ['beforeCreate', 'created', 'beforeMounted', 'mounted'];
  lifeCylesHooks.forEach(function (hook) {
    strats[hook] = mergeCyles;
  });
  function mergeCyles(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeFild(key);
    }

    for (var _key in child) {
      if (parent.hasOwnProperty(_key)) {
        continue;
      }

      mergeFild(_key);
    }

    function mergeFild(key) {
      var parentVal = parent[key];
      var childVal = child[key];

      if (strats[key]) {
        options[key] = strats[key](parentVal, childVal);
      } else {
        if (isObject(parentVal) && isObject(childVal)) {
          options[key] = _objectSpread2(_objectSpread2({}, parentVal), childVal);
        } else {
          options[key] = childVal;
        }
      }
    }

    return options; // 策略模式
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'reverse', 'splice', 'sort', 'pop'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observeArray(inserted);
      ob.dep.notice(); // 只要触发了函数的方法，就通知更新
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.watchers = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this); // watcher 里面记录dep实例
      }
    }, {
      key: "addWatcher",
      value: function addWatcher(watcher) {
        this.watchers.push(watcher);
      }
    }, {
      key: "notice",
      value: function notice() {
        this.watchers.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();
  Dep.target = null;
  var stack$1 = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack$1.push(watcher);
    console.log(watcher, 'watcher');
  }
  function popTarget() {
    stack$1.pop();
    Dep.target = stack$1[stack$1.length - 1];
  }

  var Obverse = /*#__PURE__*/function () {
    function Obverse(data) {
      _classCallCheck(this, Obverse);

      // 获取数组的值的时候，收集数组的依赖
      this.dep = new Dep();
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.wark(data);
      }
    }

    _createClass(Obverse, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          obverse(item);
        });
      }
    }, {
      key: "wark",
      value: function wark(data) {
        var _this = this;

        Object.keys(data).forEach(function (key) {
          _this.defineReactive(data, key, data[key]);
        });
      } // arr: [1,2,3] key 为arr value= [1,2,3] childBo就是 return new Obverse(data);

    }, {
      key: "defineReactive",
      value: function defineReactive(data, key, value) {
        var childBoj = obverse(value);
        var dep = new Dep();
        Object.defineProperty(data, key, {
          get: function get() {
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
          set: function set(newVal) {
            if (newVal !== value) {
              obverse(newVal);
              value = newVal;
              dep.notice(); // 通知依赖更新
            }
          }
        });
      }
    }]);

    return Obverse;
  }();

  function deepArrary(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        deepArrary(current);
      }
    }
  }

  function obverse(data) {
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__) {
      return data.__ob__;
    }

    return new Obverse(data);
  }

  function initState(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 监听数据


    obverse(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名(a div a-b等) * 表示 至少0 到1个 \\ 字符串中表示转义
  // ?:匹配不捕获  ()表示分组 ?表示？前面的可有可没有，

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // </my:xx> 用来获取标签名的， match后的索引为1的就是标签名
  // new RegExp 把字符串转为正则表达式

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  /**
   * ^\s* 开头是空格的可有可无 ([^\s"'<>\/=]+) 第一个分组 匹配属性的key 不是空格"'<>\/= 最少一个 aa
   * 第二个分组 中 ?:\s*(=)\s* 表示匹配不捕获 =前后可以有多个空格
   * ?:"([^"]*)"+ 不捕获” 捕获配“的
   */

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>

  function parseHtml(html) {
    // <div id="app">test</div>
    // 向前推进
    function advance(len) {
      html = html.substring(len);
    } // 匹配开始标签


    function parseStartTag() {
      var tagMatch = html.match(startTagOpen);

      if (tagMatch) {
        var match = {
          tagName: tagMatch[1],
          attrs: []
        };
        advance(tagMatch[0].length);
        var end, attrs;

        while (!(end = html.match(startTagClose)) && (attrs = html.match(attribute))) {
          if (attrs) {
            match.attrs.push({
              tagName: attrs[1],
              value: attrs[3] || attrs[4] || attrs[5]
            });
            advance(attrs[0].length);
          }
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false;
    } // 匹配结束标签


    function parseEndTag() {
      var tagMatch = html.match(endTag);

      if (tagMatch) {
        advance(tagMatch[0].length);
        return {
          tagName: tagMatch[1]
        };
      }

      return false;
    }

    while (html) {
      var tagEnd = html.indexOf('<');

      if (tagEnd === 0) {
        // 如果是开始的位置 可能是开始标签 也有可能是结束标签
        var startTagMatch = parseStartTag(); // 匹配的是开始标签

        if (startTagMatch) {
          parseStart(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 匹配的是结束标签 </div>


        var endTagMatch = parseEndTag();

        if (endTagMatch) {
          parseEnd(endTagMatch.tagName);
          continue;
        }
      }

      var text = void 0;

      if (tagEnd > 0) {
        text = html.substring(0, tagEnd);
        chars(text);
        advance(text.length);
        continue;
      }
    }

    return root;
  }
  var root = null; // 根元素

  var stack = []; // 构建ast语法树

  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      // 1-元素的类型 3-文本的类型
      children: [],
      parent: null,
      attrs: attrs
    };
  } // 解析开始标签


  function parseStart(tagName, attributes) {
    var parent = stack[stack.length - 1];
    var element = createAstElement(tagName, attributes);

    if (!root) {
      root = element;
    }

    element.parent = parent;

    if (parent) {
      parent.children.push(element);
    }

    stack.push(element);
  } // 解析结束标签


  function parseEnd(tagName) {
    stack.pop();
  } // 文本


  function chars(text) {
    text = text.replace(/^\s*|\s$/, '');
    if (!text) return;
    var parent = stack[stack.length - 1];
    parent.children.push({
      type: 3,
      text: text
    });
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaa}}

  function genProps(el) {
    var attrs = el.attrs;
    if (!attrs.length) return "'undefined'";
    var str = '';

    var _loop = function _loop(i) {
      var attr = attrs[i];
      var styleObj = {};

      if (attr.tagName === 'style') {
        attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
          styleObj[arguments[1]] = arguments[2];
        });
        attr.value = styleObj;
      }

      str += "".concat(attr.tagName, ": ").concat(JSON.stringify(attr.value), ",");
    };

    for (var i = 0; i < attrs.length; i++) {
      _loop(i);
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(el) {
    if (el.type === 1) {
      return generate(el);
    } else {
      var text = el.text; // hello {{aaaa}} world => 'hello' + aaaa + 'world'

      if (!defaultTagRE.test(text)) {
        return "_v('".concat(text, "')");
      } else {
        var tokens = [];
        var lastIndex = defaultTagRE.lastIndex = 0;
        var matchReg;

        while (matchReg = defaultTagRE.exec(text)) {
          var index = matchReg.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(matchReg[1].trim(), ")"));
          lastIndex = index + matchReg[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(el) {
    var children = el.children;
    if (!children.length) return false;
    return children.map(function (c) {
      return gen(c);
    }).join(',');
  }

  function generate(el) {
    var tag = el.tag;
    var props = genProps(el); // 转译属性

    var children = genChildren(el); // 转译子属性

    return "_c('".concat(tag, "', ").concat(props).concat(children ? ",".concat(children) : '', ")"); // _c(tag, attr, child...)
  }

  function complierToFunctions(template) {
    var root = parseHtml(template); // html => ast => render函数 => 虚拟dom => 真是dom

    var code = generate(root); // _c('div',{id: 'app', name: 'test'},'text') (tag, attr, child...)
    // 字符串转 方法 new Function + with

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function patch(oldVnode, vnode) {
    if (oldVnode.nodeType === 1) {
      var parentEle = oldVnode.parentElement;
      var newEl = createEl(vnode);
      parentEle.insertBefore(newEl, oldVnode);
      parentEle.removeChild(oldVnode);
      return newEl;
    }
  }
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, data, vm.key, children, undefined);
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function createEl(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
    } else {
      vnode.el = document.createTextNode(text);
    }

    children && children.forEach(function (child) {
      vnode.el.appendChild(createEl(child));
    });
    return vnode.el;
  }

  var callBack = [];
  var waiting = false;

  function flushCallback() {
    callBack.forEach(function (cb) {
      return cb();
    });
    callBack = [];
    waiting = false;
  }

  function nextTick(cb) {
    // 如果正在刷新，这个先等待，将cb 放入对列表中 等待上一轮刷新完成后，继续刷新下一轮的
    callBack.push(cb);

    if (!waiting) {
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  var has = {};
  var queue = [];
  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    has = {};
    queue = [];
  }
  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;
      queue.push(watcher);
      nextTick(flushSchedularQueue);
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.updateFn = expOrFn; // 渲染及挂载真是dom

      this.cb = cb;
      this.user = !!options.user;
      this.options = options;
      this.lanzy = !!options.lanzy; // 是否是computed watcher

      this.dirty = !!options.lanzy; // computed watcher 默认true dirty:true 取值 false 不取值

      if (typeof expOrFn === 'string') {
        this.getter = function () {
          return vm[expOrFn];
        };
      } else {
        this.getter = expOrFn;
      }

      this.deps = [];
      this.depIds = new Set();
      this.id = id++; // 默认会渲染一次组件 因为第一次new组件时，需要挂载组件

      this.value = !this.lanzy && this.get(); // 第一次渲染的值 即 旧值 computed watcher 第一次渲染不会进行取值
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 

        popTarget(); //stack 1:渲染watcher 2：computed watcher popTarget之后，Dep.target就是渲染watcher了

        if (Dep.target) {
          this.depend();
        }

        return value;
      }
    }, {
      key: "update",
      value: function update() {
        // 将更新放到 queueWatcher里的setTimerout执行 由于setTimerout是异步的，会先把同步先执行完（比如更改vm.data就是同步的操作），再执行异步的方法
        if (this.lanzy) {
          // computed 依赖更新时，把 dirty设置为true 及重新计算computed
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      } // cmpunted更新

    }, {
      key: "evealue",
      value: function evealue() {
        this.dirty = false;
        this.value = this.get();
      } // watch 更新

    }, {
      key: "run",
      value: function run() {
        // 更新时
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue;

        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depIds.has(id)) {
          this.depIds.add(id);
          this.deps.push(dep);
          dep.addWatcher(this); // dep 里面记录watcher实例
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend(); // watcher 里面记录dep实例
        }
      }
    }]);

    return Watcher;
  }(); // watcher dep

  function lifecyleMixin(Vue) {
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextElement(this, text);
    };

    Vue.prototype._s = function (val) {
      return JSON.stringify(val);
    };

    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  } // 每次每一个组件渲染就会创建一个watcher的实例

  function mountComponent(vm, el) {
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // 挂载前
    //updateComponent();
    //挂载后
    // 观察者模式： 属性：“被观察者” 刷新页面：“观察者”
    // vm updateComponent：渲染函数，cb options


    new Watcher(vm, updateComponent, function () {}, {}); // 每个组件渲染，都会创建一个对应的watcher,多个组件渲染就会创建多个watcher 
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (!handlers) return;

    for (var i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, cb, options) {
      options.user = true;
      new Watcher(this, key, cb, options);
    };
  }
  function initWatch(vm, watch) {
    for (var key in watch) {
      var cb = watch[key];
      createWatcher(vm, key, cb);
    }
  }

  function createWatcher(vm, key, cb) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    vm.$watch(key, cb, options);
  }

  function initComputed(vm, computed) {
    var watchers = vm._computedWatcher = {};

    for (var key in computed) {
      var getterObj = computed[key];
      var getter = getterObj;

      if (_typeof(getterObj) === 'object') {
        getter = getterObj.get;
      } // computed的key都创建一个watcher


      watchers[key] = new Watcher(vm, getter, function () {}, {
        lanzy: true
      }); // 代理computed的key到vm上

      definedComputed(vm, key, getterObj);
    }
  } // computed 当依赖有更新时，才会去取值，否则取缓存 使用dirty判断，true重新取值

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatcher[key];

      if (watcher.dirty) {
        watcher.evealue();
      }

      return watcher.value;
    };
  }

  function definedComputed(vm, key, getterObj) {
    var defindProxyObj = {};

    if (typeof getterObj === 'function') {
      defindProxyObj.get = createComputedGetter(key);

      defindProxyObj.set = function () {};
    } else {
      defindProxyObj.get = createComputedGetter(key);
      defindProxyObj.set = getterObj.set;
    }
    Object.defineProperty(vm, key, defindProxyObj);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options); // 创建之前

      callHook(vm, 'beforeCreate');

      if (options.data) {
        initState(vm);
      }

      callHook(vm, 'created');

      if (options.watch) {
        initWatch(vm, options.watch);
      }

      if (options.computed) {
        initComputed(vm, options.computed);
      }

      if (vm.$options.el) {
        vm.$mounted(vm.$options.el);
      }
    };

    Vue.prototype.$mounted = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!vm.$options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
          var render = complierToFunctions(template); // 将模板编译成渲染函数

          vm.$options.render = render;
        }
      } // 挂载之前


      callHook(vm, 'beforeMounted'); // 需要挂载这个组件 调用render 生成真是dom

      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (options) {
      this.options = mergeOptions(this.options, options);
      return this;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecyleMixin(Vue);
  stateMixin(Vue);
  initGlobalApi(Vue);

  return Vue;

})));
