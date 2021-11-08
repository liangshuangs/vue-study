
import path from 'path';
// import babel from 'rollup-plugin-babel';
// import resolve from 'rollup-plugin-node-resolve';
// 根据环境变量中的target属性，获取对应模块的package.json
const packagesDir = path.reslove(__dirname, 'packages');
const packageDir = path.reslove(packagesDir, process.env.TARGET);

const reslove = (p) => path.reslove(packageDir, p);
console.log(packageDir,packagesDir,'packageDir')
// export default {
//     input: 'src/main.js',
//     output: {
//         file: 'dist/bundle.js',
//         name: 'Vue',
//         format: 'umd', //兼容 规范 script导入 amd commonjs
//         sourceMap: true
//     },
//     plugins:[
//         resolve(),
//         babel({
//             exclude:'node_modules/**'
//         })
//     ]
// }