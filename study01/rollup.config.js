import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        name: 'Vue',
        format: 'umd', //兼容 规范 script导入 amd commonjs
        sourceMap: true
    },
    plugins:[
        resolve(),
        babel({
            exclude:'node_modules/**'
        })
    ]
}