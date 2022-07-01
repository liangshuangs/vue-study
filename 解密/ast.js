/**
 * 把源代码转为ast语法树
 */
// 把源代码转为ast语法树
let esprima = require('esprima');
// 遍历语法树
let estraverse = require('estraverse');
// 把转换后的语法树，重新生成源码
let codegen = require('escodegen');

/**
 * 把 let 改为var
 */
// let sourceCode = `let name = 'ast-anme'`;
// let sourceCode = `function ast () {
//     let astName = 'ast';
// }`;
// let astTree = esprima.parse(sourceCode);
// estraverse.traverse(astTree, {
//     enter(node) {
//         if (node.type === 'VariableDeclaration' && node.kind === 'let') {
//             node.kind = 'var'
//         }
//     },
//     leave(node) {
//     }
// });
// let result = codegen.generate(astTree);
// /**
//  * function ast() {
//     var astName = 'ast';
// }
//  */
// console.log(result); // var name = 'ast-anme'; 



/**
 * 箭头函数改为普通函数
 */
function transform(sourceCode, { plugin = [] }) {
    let astTree = esprima.parse(sourceCode);
    estraverse.traverse(astTree, {
        enter(node) {
            plugin.forEach(item => {
                Object.keys(item.visitor).forEach(key => {
                    if (node.type === key) {
                        item.vistor[key](node);
                    }
                })
            })
        }
    })
    let result = codegen.generate(astTree);
    return result;
}
// 箭头函数转换的插件
const ArrowFunctionExpression = {
    visitor: {
        ArrowFunctionExpression(nodePath) {
            nodePath.type = 'FunctionExpression';
        }
    }
}
// let 转为var插件
const VariableDeclaration = {
    visitor: {
        VariableDeclaration(nodePath) {
            if (nodePath.kind === 'let') {
                nodePath.kind = 'var';
            } 
        }
    }
}
let sourceCode = `
const sum = (a, b) => {
    let c = '0';
    return a + b
}
`;
let res = transform(sourceCode, {
    plugin: [ArrowFunctionExpression, VariableDeclaration]
});
console.log(res)