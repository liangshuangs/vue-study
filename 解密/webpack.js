const Compiler = require('./Compiler');
function webpack(options) {
    // 1. 初始化参数：从配置文件和shell语句中读取并合并参数，得到最终的配置对象
    let webpackConfig = process.argv.slice(2).reduce((webpackConfig, item) => {
        // item = '--mode=development'
        let [key, value] = item.split('=');
        webpackConfig[key.slice(2)] = value;
        return webpackConfig;
    }, {});
    let finalConfig = { ...options, ...webpackConfig };
    // 2. 用上一步的参数初始化Compiler对象
    let compiler = new Compiler(finalConfig);
    // 3. 加载所有配置的插件
    let { plugins } = finalConfig;
    for (plugin of plugins) {
        plugin.apply(compiler);
    }
    return compiler;
}
module.exports = webpack;