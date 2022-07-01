let { SyncHook } = require('tapable');
const Complication = require('./Complication');
let fs = require('fs');
class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 开始启动编译
            complication: new SyncHook(['complication']), // 触发编译时
            emit: new SyncHook(), // 会在将要写入文件的时候触发
            done: new SyncHook(['stats']) // 将会在完成编译是触发
        }
    }
    // 4. 执行对象的run方法并执行编译
    run(callBack) {
        this.hooks.run.call(); // 触发run钩子 开始编译
        // 这部分是编译流程
        let complication = this.compile(callBack);
        // 监听入口文件变化，重新进行编译
        // Object.values(this.options.entry).forEach((entry) => {
        //     fs.watchFile(entry, () => this.compile(callBack))
        // })
        this.hooks.done.call({
            modules: complication.modules,
            entries: complication.entries,
            chunks: complication.chunks,
            assets: complication.assets,
            files: complication.files
        }); // 编译之后触发done钩子
    }
    compile(callBack) {
        let complication = new Complication(this.options);
        complication.make(callBack);
        return complication;
    }

}
module.exports = Compiler;