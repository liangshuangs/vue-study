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