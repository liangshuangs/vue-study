import { forEach } from './util';
class Module {
    constructor(options) {
        this._raw = options;
        this.state = options.state;
        this._children = {};
    }
    getChild(path) {
        return this._children[path];
    }
    addChild(path, module) {
        this._children[path] = module;
    }
    forEacthGetter(cb) {
        this._raw.getters && forEach(this._raw.getters, cb)
    }
    forEacthMutations(cb) {
        this._raw.mutations && forEach(this._raw.mutations, cb)
    }
    forEacthAction(cb) {
        this._raw.actions && forEach(this._raw.actions, cb)
    }
    forEacthChildren(cb) {
        this._children && forEach(this._children, cb)
    }
    get namespaced() {
        return !!this._raw.namespaced;
    }
}

export default Module;