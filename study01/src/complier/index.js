/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-04-19 11:29:29
 * @LastEditTime: 2021-06-11 15:45:00
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
import { parseHtml } from './parse';
import { generate } from './generate';
// 把模板转化成渲染函数
export function complierToFunctions(template) {
    let root = parseHtml(template);
    // html => ast => render函数 => 虚拟dom => 真是dom
    let code = generate(root); // _c('div',{id: 'app', name: 'test'},'text') (tag, attr, child...)
    // 字符串转 方法 new Function + with
    let render = new Function(`with(this){return ${code}}`);
    return render;
}