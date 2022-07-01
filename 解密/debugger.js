const webpack = require('webpack');
// const webpack = require('./webpack');
const webpackOptions = require('./webpack.config');
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
    // console.log(stats.toJson({
    //     files: true,
    //     assets: true,
    //     chunk: true,
    //     module: true,
    //     entries: true
    // }), null,2)
})