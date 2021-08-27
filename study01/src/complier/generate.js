/*
 * @Description: 
 * @Author: liangshuang15
 * @Date: 2021-04-26 19:31:17
 * @LastEditTime: 2021-08-27 15:05:46
 * @LastEditors: Please set LastEditors
 * @Reference: 
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaa}}

function genProps(el) {
    let attrs = el.attrs;
    if (!attrs.length) return `undefined`;
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        let styleObj = {};
        if (attr.tagName === 'style') {
            attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2];
            })
            attr.value = styleObj;
        }
        str += `${attr.tagName}: ${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`;
}
function gen(el) {
    if (el.type === 1) {
        return generate(el);
    } else {
        let text = el.text; // hello {{aaaa}} world => 'hello' + aaaa + 'world'
        if (!defaultTagRE.test(text)) {
            return `_v('${text}')`;
        } else {
            let tokens = [];
            let lastIndex = defaultTagRE.lastIndex = 0;
            let matchReg;
            while (matchReg = defaultTagRE.exec(text)) {
                let index = matchReg.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${matchReg[1].trim()})`);
                lastIndex = index + matchReg[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`;
        } 
    }
}
function genChildren(el) {
    let children = el.children;
    if (!children.length) return false;
    return children.map(c => gen(c)).join(',');
}
export function generate(el) {
    let tag = el.tag;
    let props = genProps(el); // 转译属性
    let children = genChildren(el); // 转译子属性
    return `_c('${tag}', ${props}${children ? `,${children}` : ''})`; // _c(tag, attr, child...)
}