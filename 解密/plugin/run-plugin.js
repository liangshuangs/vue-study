class RunPlugin {
    apply(compiler) {
        compiler.hooks.run.tap('runPlugin', (complication) => {
            //console.log(complication,'run plugin')
        });
    }
}
module.exports = RunPlugin;
