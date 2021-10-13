(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

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

  strats.components = function (parentVal, childVal) {
    var options = Object.create(parentVal);

    for (var key in childVal) {
      options[key] = childVal[key];
    }

    return options;
  };

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
          options[key] = childVal || parentVal;
        }
      }
    }

    return options; // 策略模式
  }
  function isReservedTag(tag) {
    var reservedTag = 'span,div,button,i,ul,li,a';
    return reservedTag.includes(tag);
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
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
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
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Obverse;
  }(); // arr: [1,2,3] key 为arr value= [1,2,3] childBo就是 return new Obverse(data);


  function defineReactive(data, key, value) {
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
  function set(target, key, value) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, value);
      return val;
    } // 判断如果key本来就是对象中的一个属性，并且key不是Object原型上的属性。说明这个key本来就在对象上面已经定义过了的，直接修改值就可以了，可以自动触发响应。


    if (key in target && !(key in Object.prototype)) {
      target[key] = value;
      return value;
    } // 首先定义变量ob的值为 target.__ob__，这个__ob__属性到底是什么对象呢？vue给响应式对象都加了一个__ob__属性，如果一个对象有这个__ob__属性，那么就说明这个对象是响应式对象，我们修改对象已有属性的时候就会触发页面渲染。


    var ob = target.__ob__;

    if (!ob) {
      target[key] = value;
      return value;
    } // 这里其实才是vue.set()真正处理对象的地方。defineReactive(ob.value, key, val)的意思是给新加的属性添加依赖，以后再直接修改这个新的属性的时候就会触发页面渲染。
    // ob.dep.notice()这句代码的意思是触发当前的依赖（这里的依赖依然可以理解成渲染函数），所以页面就会进行重新渲染。


    defineReactive(target, key, value);
    ob.dep.notice();
    return value;
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
    var root = null; // 根元素

    var stack = []; // 向前推进

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
    } // 构建ast语法树


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

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-04-26 19:31:17
   * @LastEditTime: 2021-08-27 15:05:46
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaa}}

  function genProps(el) {
    var attrs = el.attrs;
    if (!attrs.length) return "undefined";
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

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-04-19 11:29:29
   * @LastEditTime: 2021-06-11 15:45:00
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */

  function complierToFunctions(template) {
    var root = parseHtml(template); // html => ast => render函数 => 虚拟dom => 真是dom

    var code = generate(root); // _c('div',{id: 'app', name: 'test'},'text') (tag, attr, child...)
    // 字符串转 方法 new Function + with

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-06-11 11:30:35
   * @LastEditTime: 2021-07-29 11:27:13
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */
  function patch(oldVnode, vnode) {
    // 如果是子组件渲染，没有el就没有oldVnode，直接返回真是dom就行，不要进行insertBefore到body上
    if (!oldVnode) {
      return createEl(vnode);
    } //nodeType= 1为真实的dom


    if (oldVnode.nodeType === 1) {
      var parentEle = oldVnode.parentElement;
      var newEl = createEl(vnode); // 将虚拟节点转成真是节点

      parentEle.insertBefore(newEl, oldVnode);
      parentEle.removeChild(oldVnode);
      return newEl;
    } else {
      var el = oldVnode.el;
      var newDom = createEl(vnode);
      el.parentElement.replaceChild(newDom, oldVnode.el);
      return; // let el = oldVnode.el;
      // let oldChildren = oldVnode.children || [];
      // let newChildren = vnode.children || [];
      // // diff 标签不一样，直接替换
      // if (oldVnode.tag === undefined) {
      //     if (oldVnode.text !== vnode.text) {
      //         el.textConent = vnode.text;
      //         return el;
      //     }
      // }
      // if (oldVnode.tag !== vnode.tag) {
      //     // oldVnode.el存放这真是的dom
      //     let newDom = createEl(vnode);
      //     el.parentElement.replaceChild(newDom, oldVnode.el);
      // } else if (oldChildren.length > 0 && newChildren.length > 0) {
      //     // 双方都有子节点 采用双指针的方法
      // } else if (oldChildren.length > 0) {
      //     // 老的节点有子节点 新的没有子节点
      //     el.innerHTML = '';
      // } else if (newChildren.length > 0) {
      //     // 新的有子节点，老的没有
      //     for (let i = 0; i < newChildren.length; i++) {
      //         let child = newChildren[i];
      //         el.appendChild(createEl(child));
      //     }
      // }
    }
  } // patch 属性

  function patchProps(vnode, oldPorps) {
    var props = vnode.data || {};

    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props[key]) {
          vnode.el.style[styleName] = props[key][styleName];
        }
      } else {
        vnode.el && vnode.el.setAttribute(key, props[key]);
      }
    }
  }
  /**
   * @description: 
   * @param {*} vm
   * @param {*} tag
   * @param {*} data
   * @param {array} children
   * @return {*}返回一个虚拟节点
   */
  // return _c(
  //     'div',
  //     { id: "app", style: { "color": "red", "background": " gren" } },
  //     _c('span', { class: "ab" }, _v('测试')),
  //     _c('my-button', undefined)
  // )

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    //return vnode(vm, tag, data,vm.key, children, undefined);
    // 是否是原生的标签
    if (isReservedTag(tag)) {
      for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        children[_key - 3] = arguments[_key];
      }

      return vnode(vm, tag, data, vm.key, children, undefined);
    } else {
      //将保持在vm.$options.components的对应的组件取出来
      var subComponent = vm.$options.components[tag]; // 此时这个my-button是通过Vue.component方法挂载的，所以这个subComponent就是一个子组件的构造函数

      return createComponent(vm, "vue-component-".concat(tag), data, vm.key, subComponent);
    }
  }
  function createComponent(vm, tag, data, key, Cotr) {
    // 如果是在组件里面通过  components: {'my-button': {template: `<buttton>world</button>`}}创建的子组件，则就是一个object
    // 需要将object变成一个构造函数
    if (isObject(Cotr)) {
      Cotr = vm.$options._base.extend(Cotr);
      data.hook = {
        init: function init(vnode) {
          var child = new Cotr({
            isComponent: true
          }); // 挂载子组件，new Cotr就会执行_init()方法

          child.$mounted();
          vnode.instance = child.$el;
        }
      };
    }
    return vnode(vm, tag, data, key, undefined, undefined, {
      Cotr: Cotr
    });
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text, Cotr) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      Cotr: Cotr
    };
  } // 

  /**
   * @description: 生成真是的节点
   * @param {*} vnode 虚拟dom
   * @return {*}
   */


  function createEl(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      if (createComponentEl(vnode)) {
        return vnode.instance;
      }

      vnode.el = document.createElement(tag);
      patchProps(vnode);
    } else {
      vnode.el = document.createTextNode(text);
    }

    children && children.forEach(function (child) {
      vnode.el.appendChild(createEl(child));
    });
    return vnode.el;
  }

  function createComponentEl(vnode) {
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
      return true;
    }
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
      value: function get(upate) {
        pushTarget(this); // Dep.target = this this 就是watcher实例

        var value = this.getter.call(this.vm, upate); // 即调用 vm._update(vm._render());会触发取vm的上的值的方法 

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
        this.vm.oldNode = this.vm.Node;
        var newValue = this.get('update');
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

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-06-11 11:30:35
   * @LastEditTime: 2021-07-29 11:18:05
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */
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

    Vue.prototype._update = function (vnode, update) {
      var vm = this;

      if (update) {
        vm.$el = patch(vm.oldNode, vnode);
      } else {
        vm.$el = patch(vm.$el, vnode);
      }
    };
  } // 每次每一个组件渲染就会创建一个watcher的实例

  function mountComponent(vm) {
    var updateComponent = function updateComponent(update) {
      vm._update(vm._render(), update);
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
        }

        var render = complierToFunctions(template); // 将模板编译成渲染函数

        vm.$options.render = render;
      } // 挂载之前


      callHook(vm, 'beforeMounted'); // 需要挂载这个组件 调用render 生成真是dom

      mountComponent(vm);
    };
  }

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-05-12 11:35:35
   * @LastEditTime: 2021-06-11 18:45:55
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */
  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      vm.Node = vnode;
      return vnode;
    };
  }

  function initUse(Vue) {
    /**
     * plugin Function | Object
     * 要么是方法，要么是对象，并且有install方法
     */
    Vue.use = function (plugin) {
      var installedPlugins = this._installedPlugins || (this._installedPlugins = []);

      if (installedPlugins.indexOf(plugin) > -1) {
        return this;
      }
      var args = toArray(arguments, 1); // 删除最后一个入参

      args.unshift(this); // this 指向Vue 第一个参数就是Vue

      if (typeof plugin.install === 'function') {
        plugin.install.apply(this, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this;
    };
  }

  function toArray(list) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var i = list.length - start;
    var res = new Array(i);

    while (i--) {
      res[i] = list[i - start];
    }
    return res;
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (options) {
      this.options = mergeOptions(this.options, options);
      return this;
    };
    /**
     * @description: 挂载全局组件
     * @param {*} id 组件ID
     * @param {*} opts 组件参数
     * @return {*} 返回一个构造函数
     */


    Vue.options._base = Vue;
    Vue.options.components = {}; // Vue options上所有的参数都会和vue实例的options合并 vm.$options = mergeOptions(vm.constructor.options, options);

    Vue.component = function (id, opts) {
      // 为保证每个组件的独立，每个组件必须是一个单独的实例 那么这个组件必须要继承Vue上的属性和方法
      Vue.options.components[id] = Vue.extend(opts);
    };

    Vue.extend = function (opts) {
      var Super = this; // 子组件的构造函数

      var Sub = function Vuecomponent(options) {
        // 继承了Vue上的_init方法，即初始化组件
        this._init(options);
      };

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, opts);
      return Sub;
    };

    Vue.set = set;
    initUse(Vue);
  }

  /*
   * @Description: 
   * @Author: liangshuang15
   * @Date: 2021-04-16 16:22:48
   * @LastEditTime: 2021-07-28 17:26:37
   * @LastEditors: Please set LastEditors
   * @Reference: 
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecyleMixin(Vue);
  stateMixin(Vue);
  initGlobalApi(Vue); // 标签不一样

  var forEach = function forEach(obj, fn) {
    Object.keys(obj).forEach(function (key) {
      fn(obj[key], key);
    });
  };

  var Module = /*#__PURE__*/function () {
    function Module(options) {
      _classCallCheck(this, Module);

      this._raw = options;
      this.state = options.state;
      this._children = {};
    }

    _createClass(Module, [{
      key: "getChild",
      value: function getChild(path) {
        return this._children[path];
      }
    }, {
      key: "addChild",
      value: function addChild(path, module) {
        this._children[path] = module;
      }
    }, {
      key: "forEacthGetter",
      value: function forEacthGetter(cb) {
        this._raw.getters && forEach(this._raw.getters, cb);
      }
    }, {
      key: "forEacthMutations",
      value: function forEacthMutations(cb) {
        this._raw.mutations && forEach(this._raw.mutations, cb);
      }
    }, {
      key: "forEacthAction",
      value: function forEacthAction(cb) {
        this._raw.actions && forEach(this._raw.actions, cb);
      }
    }, {
      key: "forEacthChildren",
      value: function forEacthChildren(cb) {
        this._children && forEach(this._children, cb);
      }
    }, {
      key: "namespaced",
      get: function get() {
        return !!this._raw.namespaced;
      }
    }]);

    return Module;
  }();

  /**
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
   */

  var StoreModules = /*#__PURE__*/function () {
    function StoreModules(options) {
      _classCallCheck(this, StoreModules);

      // 对数据进行格式化操作
      this.root = null;
      this.register([], options);
    }

    _createClass(StoreModules, [{
      key: "getNameSpaces",
      value: function getNameSpaces(path) {
        var root = this.root;
        var ns = path.reduce(function (memo, current) {
          var module = root.getChild(current);
          root = module;
          return module.namespaced ? memo + current + '/' : current;
        }, '');
        return ns;
      } // 注册数据

    }, {
      key: "register",
      value: function register(path, rootMoudles) {
        var _this = this;

        var newModule = new Module(rootMoudles); // 如果是根

        if (path.length === 0) {
          this.root = newModule;
        } else {
          /**
           * 当path=[home] => newPath = [];  parent= this.root, key = home this.root._children[home] = newModule
           * 当path=[order] => newPath = []; parent= this.root, key = order this.root._children[order] = newModule
           * 当path=[order, subOrder] newPath = [order] parent= this.root_children[order] key=subOrder this.root_children[order]._chilren[subOrder] = newModule
           */
          var newPath = path.slice(0, -1); // 为去掉最后一个
          // memo为当前传入的 currentValue当前的值

          var parent = newPath.reduce(function (memo, currentValue) {
            return memo.getChild(currentValue);
          }, this.root);
          var key = path[path.length - 1];

          if (parent) {
            parent.addChild(key, newModule);
          }
        }

        if (rootMoudles.modules) {
          forEach(rootMoudles.modules, function (module, key) {
            _this.register(path.concat(key), module);
          });
        }
      }
    }]);

    return StoreModules;
  }();

  function install(Vue) {
    Vue.mixin({
      beforeCreate: function beforeCreate() {
        var options = this.$options;

        if (options.store) {
          this.$store = options.store;
        } else {
          // 先保证他是一个子组件，并且父亲上有$store
          if (this.$parent && this.$parent.$store) {
            this.$store = this.$parent.$store;
          }
        }
      }
    });
  }

  function installModule(store, rootState, path, module) {
    // 将模块state挂载到根的state上 [home] [order] [order, subOrder]
    var ns = store._modules.getNameSpaces(path);

    if (path.length) {
      var parent = path.slice(0, -1).reduce(function (memo, current) {
        return memo[current];
      }, rootState);
      var key = path[path.length - 1]; // vue新增属性，不是响应式

      if (parent) {
        Vue.set(parent, key, module.state);
      }
    } // 将getter 加载到this.getter上


    module.forEacthGetter(function (fn, key) {
      store.wrapperGetter[ns + key] = function () {
        return fn.call(store, module.state);
      };
    });
    module.forEacthMutations(function (fn, key) {
      store.mutations[ns + key] = store.mutations[ns + key] || []; // 模块化这里是一个数组

      store.mutations[ns + key].push(function (payload) {
        return fn.call(store, module.state, payload);
      });
    });
    module.forEacthAction(function (fn, key) {
      store.actions[ns + key] = store.actions[ns + key] || [];
      store.actions[ns + key].push(function (payload) {
        return fn.call(store, store, payload);
      });
    });
    module.forEacthChildren(function (childModule, key) {
      //console.log(childModule, key)
      installModule(store, rootState, path.concat(key), childModule);
    });
  }

  var Store = /*#__PURE__*/function () {
    function Store(options) {
      var _this = this;

      _classCallCheck(this, Store);

      var state = options.state; // 需要对用户的模块进行整合

      this._modules = new StoreModules(options);
      var computed = {};
      this.getters = {};
      this.wrapperGetter = {};
      this.mutations = {};
      this.actions = {}; // 将所有的 mutations actions都挂载到this 上

      installModule(this, state, [], this._modules.root);
      forEach(this.wrapperGetter, function (getter, key) {
        computed[key] = getter;
        Object.defineProperty(_this.getters, key, {
          get: function get() {
            return _this._vm[key];
          }
        });
      }); // 这里new 了一个vue的实例，当这个实例的data被取值时，就会收集对应的渲染watcher,这样数据更新时，视图就会更新

      this._vm = new Vue({
        data: {
          $$state: state
        },
        computed: computed
      });
    } // 当对state进行取值时，比如store.state 其实就是取this._vm.data.$$state的值，


    _createClass(Store, [{
      key: "state",
      get: function get() {
        return this._vm._data.$$state;
      }
    }, {
      key: "commit",
      value: function commit(type, payload) {
        this.mutations[type] && this.mutations[type].forEach(function (fn) {
          return fn(payload);
        });
      }
    }, {
      key: "dispatch",
      value: function dispatch(type, payload) {
        this.actions[type] && this.actions[type].forEach(function (fn) {
          return fn(payload);
        });
      }
    }]);

    return Store;
  }();

  var Vuex = {
    install: install,
    Store: Store
  };

  var home = {
    namespaced: true,
    state: {
      name: 'home 名称'
    }
  };

  var order = {
    namespaced: true,
    state: {
      name: 'order 名称'
    },
    // 所有的getter 都会合并到gen上，注意不要同名了，免得被覆盖
    getters: {
      myOrderName: function myOrderName(state) {
        return state.name;
      }
    },
    mutations: {
      changeOrderName: function changeOrderName(state, payload) {
        state.name = payload;
      }
    },
    actions: {
      // 异步操作
      handleOrderName: function handleOrderName(vm, payload) {
        setTimeout(function () {
          vm.commit('order/changeOrderName', payload);
        }, 3000);
      }
    },
    modules: {
      subOrder: {
        namespaced: true,
        state: {
          name: 'suborder 名称'
        },
        getters: {
          mySubOrderName: function mySubOrderName(state) {
            return state.name;
          }
        }
      }
    }
  };

  Vue.use(Vuex);
  var store = new Vuex.Store({
    namespaced: true,
    state: {
      name: '我是小明'
    },
    getters: {
      myName: function myName(state) {
        return state.name;
      }
    },
    mutations: {
      // method  commit 同步更改状态
      changeName: function changeName(state, payload) {
        state.name = payload;
      }
    },
    actions: {
      // 异步操作
      handleName: function handleName(vm, payload) {
        setTimeout(function () {
          vm.commit('changeName', payload);
        }, 3000);
      }
    },
    modules: {
      home: home,
      order: order
    }
  });

  var vm = new Vue({
    data: {
      message: 'hello'
    },
    store: store,
    el: '#app'
  });

  exports.vm = vm;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
