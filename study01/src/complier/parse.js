const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名(a div a-b等) * 表示 至少0 到1个 \\ 字符串中表示转义
// ?:匹配不捕获  ()表示分组 ?表示？前面的可有可没有，
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // </my:xx> 用来获取标签名的， match后的索引为1的就是标签名
// new RegExp 把字符串转为正则表达式
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
/**
 * ^\s* 开头是空格的可有可无 ([^\s"'<>\/=]+) 第一个分组 匹配属性的key 不是空格"'<>\/= 最少一个 aa
 * 第二个分组 中 ?:\s*(=)\s* 表示匹配不捕获 =前后可以有多个空格
 * ?:"([^"]*)"+ 不捕获” 捕获配“的
 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaa}}

export function parseHtml(html) { // <div id="app">test</div>
    // 向前推进
    function advance(len) {
        html = html.substring(len);
    }
    // 匹配开始标签
    function parseStartTag() {
        const tagMatch = html.match(startTagOpen);
        if (tagMatch) {
            const match = {
                tagName: tagMatch[1],
                attrs: []
            };
            advance(tagMatch[0].length);
            let end, attrs;
            while (!(end = html.match(startTagClose)) && (attrs = html.match(attribute))){
                if (attrs) {
                    match.attrs.push({ tagName: attrs[1], value: attrs[3] || attrs[4] || attrs[5] });
                    advance(attrs[0].length);
                }
            }
            if (end) {
                advance(end[0].length);
            }
            return match;
        }
        return false;
    }
    // 匹配结束标签
    function parseEndTag() {
        const tagMatch = html.match(endTag);
        if (tagMatch) {
            advance(tagMatch[0].length);
            return {
                tagName: tagMatch[1]
            };
        }
        return false;
    }
    while (html) {
        let tagEnd = html.indexOf('<');
        if (tagEnd === 0) { // 如果是开始的位置 可能是开始标签 也有可能是结束标签
            const startTagMatch = parseStartTag();
            // 匹配的是开始标签
            if (startTagMatch) {
                parseStart(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            // 匹配的是结束标签 </div>
            const endTagMatch = parseEndTag();
            if (endTagMatch) {
                parseEnd(endTagMatch.tagName);
                continue;
            }
        }
        let text;
        if (tagEnd > 0) {
            text = html.substring(0, tagEnd);
            chars(text);
            advance(text.length);
            continue;
        }
    }
    return root;
}
let root = null; // 根元素
let stack = [];
// 构建ast语法树
function createAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1, // 1-元素的类型 3-文本的类型
        children: [],
        parent: null,
        attrs
    }
}
// 解析开始标签
function parseStart(tagName, attributes) {
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attributes);
    if (!root) {
        root = element;
    }
    element.parent = parent;
    if (parent) {
        parent.children.push(element);
    }
    stack.push(element);
}
// 解析结束标签
function parseEnd(tagName) {
    stack.pop();
}
// 文本
function chars(text) {
    text = text.replace(/^\s*|\s$/, '');
    if (!text) return;
    let parent = stack[stack.length - 1];
    parent.children.push({
        type: 3,
        text: text
    });
};