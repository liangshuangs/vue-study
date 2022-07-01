const asyncLib = require("neo-async");
class FlagDependencyExportsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('FlagDependencyExportsPlugin', (compilation) => {
            const moduleGraph = compilation.moduleGraph;
            const { moduleMemCaches } = compilation;
            const cache = compilation.getCache("FlagDependencyExportsPlugin");
            // 完成编译模块后 触发的钩子
            compilation.hooks.finishModules.tapAsync('FlagDependencyExportsPlugin', (modules, callback) => {
                let statRestoredFromMemCache = 0;
						let statRestoredFromCache = 0;
						let statNoExports = 0;
						let statFlaggedUncached = 0;
						let statNotCached = 0;
						let statQueueItemsProcessed = 0;
                // 遍历modules
                asyncLib.each(
                    modules,
                    (module, callback) => {
                        // 找出exportsInfo
                        const exportsInfo = moduleGraph.getExportsInfo(module);
                        cache.get(
                            module.identifier(),
                            module.buildInfo.hash,
                            (err, result) => {
                                if (err) return callback(err);

                                if (result !== undefined) {
                                    statRestoredFromCache++;
                                    exportsInfo.restoreProvided(result);
                                } else {
                                    statNotCached++;
                                    // Without cached info enqueue module for determining the exports
                                    exportsInfo.setHasProvideInfo();
                                }
                                callback();
                            }
                        );
                    }
                )
            })
        })
    }
}
module.exports = FlagDependencyExportsPlugin;