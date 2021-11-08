// 把package目录下所有包进行打包
const fs = require('fs');
const execa = require('execa'); // 开启子进程 进行打包 最终还是用rollup打包
const targets = fs.readdirSync('packages').filter(file => {
    if (!fs.statSync(`packages/${file}`).isDirectory()) {
        return false;
    };
    return true;
});
// 进行并且打包
function runParallel(targets, build) {
    const res = [];
    for (const item of targets) {
        const p = build(item);
        res.push(p);
    }
    return Promise.all(res);
}
async function build(target) { // {stdio: 'inherit'} 子进程打包的信息共享给父进程
    await execa('rollup', ['-c', '--environment',`TARGET:${target}`], {stdio: 'inherit'})
}
runParallel(targets, build);