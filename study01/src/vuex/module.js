import { forEach } from './util'
class Module {
    constructor(rawModule) {
        this._raw = rawModule;
        this._children = {};
        this.state = rawModule.state;
    }
    getChild(childName) {
        return this._children[childName]
    }
    addChild(childName, module) {
        this._children[childName] = module
    }
    forEachGetter(cb) {
        this._raw.getters && forEach(this._raw.getters, cb);
    }
    forEachChildren(cb) {
        this._children && forEach(this._children, cb);
    }
}


export default Module