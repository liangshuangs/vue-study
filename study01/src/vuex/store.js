import { forEach } from './util';
import Module from './Module';
/**
 this.root = {
    _row: 用户定义的模块,
    state: 用户自己的state,
    _children: {
        home: {

        },
        order: {
            _children: {
                subOrder: {
                    
                }
            }
        }
    }

}
 */
class StoreModules {
    constructor(options) {
        // 对数据进行格式化操作
        this.root = null;
        this.register([], options);
    }
    getNameSpaces(path) {
        let root = this.root;
        let ns = path.reduce((memo, current) => {
            const module = root.getChild(current);
            root = module;
            return module.namespaced ? memo + current + '/' : current;
        }, '');
        return ns;
    }
    // 注册数据
    register(path, rootMoudles) {
        let newModule = new Module(rootMoudles);
        // 如果是根
        if (path.length === 0) {
            this.root = newModule;
        }
        else {
            /**
             * 当path=[home] => newPath = [];  parent= this.root, key = home this.root._children[home] = newModule
             * 当path=[order] => newPath = []; parent= this.root, key = order this.root._children[order] = newModule
             * 当path=[order, subOrder] newPath = [order] parent= this.root_children[order] key=subOrder this.root_children[order]._chilren[subOrder] = newModule
             */
            let newPath = path.slice(0, -1); // 为去掉最后一个
            // memo为当前传入的 currentValue当前的值
            let parent = newPath.reduce((memo, currentValue) => {
                return memo.getChild(currentValue);
            }, this.root);
            let key = path[path.length - 1];
            if (parent) {
                parent.addChild(key, newModule);
            }
        }
        if (rootMoudles.modules) {
            forEach(rootMoudles.modules, (module, key) => {
                this.register(path.concat(key), module);
            })
        }
    }
}


export default StoreModules;