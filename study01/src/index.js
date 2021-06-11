/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-04-16 16:22:48
 * @LastEditTime: 2021-06-11 19:30:33
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
import initMixin from './initMixin';
import renderMixin from './render';
import { stateMixin } from './stateMixin';
import { lifecyleMixin } from './lifecyle';
import { initGlobalApi } from './global-api';

import { complierToFunctions } from './complier'
import { createEl, patch} from './vdom';
function Vue(options) {
   this._init(options);
}
initMixin(Vue);
renderMixin(Vue);
lifecyleMixin(Vue);
stateMixin(Vue);
initGlobalApi(Vue);

// 标签不一样
// let oldTemplate = `<div id="a">hello</div>`;
// let newTemplate = `<span id="b">world</span>`;

// 属性不一样
// let oldTemplate = `<div id="a" style="color:red">hello</div>`;
// let newTemplate = `<div id="b">hello</div>`;

// 老的节点有子节点 新的没有子节点
// let oldTemplate = `<div id="a" style="color:red">hello</div>`;
// let newTemplate = `<div id="b"></div>`;

// 新的有子节点，老的没有
// let oldTemplate = `<div id="a" style="color:red"></div>`;
// let newTemplate = `<div id="b">hello</div>`;

// 都有子节点
// 新的有子节点，老的没有
let oldTemplate = `<div id="a" style="color:red">world</div>`;
let newTemplate = `<div id="b">hello</div>`;

let vm1 = new Vue({data: {message: 'word'}});
let oldNode = complierToFunctions(oldTemplate).call(vm1);
let oldDom = createEl(oldNode);
document.body.appendChild(oldDom);

let vm2 = new Vue({data: {message: 'word'}});
let newNode = complierToFunctions(newTemplate).call(vm2);
patch(oldNode, newNode);



export default Vue;