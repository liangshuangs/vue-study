class DonePlugin {
    apply(compiler) {
        compiler.hooks.done.tap('donePlugin', (stats) => {
            //console.log('done plugin---',stats)
        });
    }
}
module.exports = DonePlugin;
