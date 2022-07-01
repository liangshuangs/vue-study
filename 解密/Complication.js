let path = require('path');
let fs = require('fs');
let types = require('babel-types');
let parser = require('@babel/parser');
let traverse = require('@babel/traverse').default;
let generator = require('@babel/generator').default;
const baseDir = process.cwd();
class Complication {
    constructor(options) {
        this.options = options;
        this.entries = []; // 所有的入口
        this.modules = []; // 所有的模块
        this.chunks = []; // 所有的代码块
        this.assets = {}; // 所有的静态资源
        this.files = []; // 所有的产出文件
    }
    make(callBack) {
        // 5. 根据配置中的entry找出入口文件
        let entry = {};
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry;
        } else {
            entry = this.options.entry
        };
        for (let entryName in entry) {
            // 找绝对路径
            let entryPath = path.join(this.options.context, entry[entryName]);
            let entryModule = this.buildModule(entryName, entryPath); 
            //this.modules.push(entryModule);
            // 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
            let chunk = {name: entryName, entryModule, modules: this.modules.filter(item => item.name === entryName)}
            this.entries.push(chunk);
            this.chunks.push(chunk);
            // 9. 再把每个chunk转换成一个单独的文件加到输出列表
            this.chunks.forEach(chunk => {
                let filename = this.options.output.filename.replace('[name]', chunk.name);
                this.assets[filename] = getSource(chunk);
                
            })
        }
        this.files = Object.keys(this.assets);
        // 10. 再确定好输出内容后，根据配置确定输出的路径和文件名，把文件写入到文件系统
        for (let filename in this.assets) {
            let filePath = path.resolve(this.options.output.path, filename);
            console.log(filePath,'filePath')
            fs.writeFileSync(filePath, this.assets[filename], 'utf8');
        }
        callBack(null, {
            toJson: () => {
                return {
                    modules: this.modules,
                    entries: this.entries,
                    chunks: this.chunks,
                    assets: this.assets,
                    files: this.files
                }    
            }
        })
    }
    buildModule(name, modulePath) {
        // 6. 从入口文件触发，调用所有配置的Loader对模块进行编译 
        // 1. 读取入口文件
        let sourceCode = fs.readFileSync(modulePath, 'utf8');
        let loaders = [];
        let rules = this.options.module.rules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].test.test(modulePath)) {
                loaders = [...loaders, ...rules[i].use];
            }
        }
        for (let i = loaders.length - 1; i >= 0; i--) {
            sourceCode = require(loaders[i])(sourceCode);
        }
        // 7. 再找出改模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        // 当前模块的模块ID
        let moudleId = './' + path.posix.relative(baseDir, modulePath); // ./解密/src/entry1.js
        let module = {id: moudleId, dependencies: [], name};
        traverse(ast, {
            CallExpression: ({ node }) => {
                if (node.callee.name === 'require') {
                    // 依赖的模块名
                    let moduleName = node.arguments[0].value;
                    // 当前模块所在的目录
                    let dirname = path.posix.dirname(modulePath); // /Users/liangshuang15/Documents/root/vue-study/解密/src
                    let depModulePath = path.posix.join(dirname, moduleName);
                    let extensions = this.options.resolve.extensions;
                    depModulePath = tryExtensions(depModulePath, extensions);
                    // 依赖模块ID ./解密/src/title.js
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
                    node.arguments = [types.stringLiteral(depModuleId)]; // 修改ast的结构
                    module.dependencies.push(depModulePath);
                }
            }
        })
        let { code } = generator(ast); // 重新生成代码
        module._source = code;
        module.dependencies.forEach(dependency => {
            let dependencyModule = this.buildModule(name, dependency);
            this.modules.push(dependencyModule);
        });
        return module;
    }
}
function tryExtensions(modulePath, extensions) {
    extensions.unshift('');
    for (let i = 0; i < extensions.length; i++) {
        let fileName = modulePath + extensions[i];
        if (fs.existsSync(fileName)) {
            return fileName;
        }   
    }
    throw new Error('module not found')

}
function getSource(chunk) {
    return `
    (() => {
        var modules = ({
            ${
        chunk.modules.map(module => `
            "${module.id}": (module, exports, require) => {
                ${module._source}
            } 
        `).join(',')
            }
        });
        var cache = {};
        function require(moduleId) {
            var cachedModule = cache[moduleId];
            if (cachedModule !== undefined) {
                return cachedModule.exports;
            }
            var module = cache[moduleId] = {
                exports: {}
            };
            modules[moduleId](module, module.exports, require);
            return module.exports;
        }
   var exports = {};
   (() => {
    ${chunk.entryModule._source}
   })();
    })();
    `
}
module.exports = Complication;