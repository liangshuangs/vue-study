import Module from './module';
import { forEach } from './util';

class ModuleCollection {
    constructor(options) {
        this.root = null;
        this.register([], options);
    }
    getNameSpace(path) { // path  = [a, b, c] 返回一个字符串 a/b/c
        let root = this.root;
        let ns = path.reduce((ns, key) => {
            let module = root.getChild(key);
            root = module;
            ns = module.namespaced ? ns + key + '/' : ns;
        }, '');
        return ns;
    }
    register(path, rawModule) {
        if (!rawModule) {
            return;
        }
        let newModule = new Module(rawModule);
        if (path.length == 0) {
            this.root = newModule;
        }
        else {
            // path = ['index'] ['home'] ['home', 'subHome']
            /**
             * path = ['home'] -->path.slice(0, -1) = [],所以parent = this.root就是最外层
             * parent.addChild(pat9h[path.length - 1], rawModule); 所以最外层的_children有_children[home]
             * 
             * 
             * ['home', 'subHome'] -->path.slice(0, -1) = ['home'] mom是this.root,current 是home
             * mom.getChild(current)拿到的是_children[home]的值
             * parent.addChild(path[path.length - 1], rawModule); 那么_children[home]的值的_children有_children[subHome]
             */
            let parent = path.slice(0, -1).reduce((mom, current) => {
                return mom.getChild(current);
            }, this.root);
            parent.addChild(path[path.length - 1], newModule);
        }
        if (rawModule.modules) {
            forEach(rawModule.modules, (modules, key) => {
                this.register(path.concat(key), modules);
            })
        }
    }
}
export default ModuleCollection;