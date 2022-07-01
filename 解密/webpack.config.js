/*
 * @Author: your name
 * @Date: 2021-11-15 09:58:55
 * @LastEditTime: 2021-11-30 20:03:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-study/解密/webpack.config.js
 */
const path = require('path');
const RunPlugin = require('./plugin/run-plugin');
const DonePlugin = require('./plugin/done-plugin');
const FlagDependencyExportsPlugin = require('./plugin/FlagDependencyExportsPlugin');
module.exports = {
    mode: 'production',
    devtool: false,
    context: process.cwd(),
    entry: {
        entry1: './解密/src/entry1.js'
    },
    optimization: {
        usedExports: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jxs', '.json']
    },
    devServer: {
        hot: true,
        port: 8080
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                path.resolve(__dirname, 'loader', 'logger1_loader.js'),
                path.resolve(__dirname, 'loader', 'logger2_loader.js')
            ]
        }]
    }

}