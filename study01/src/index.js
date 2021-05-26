import initMixin from './initMixin';
import renderMixin from './render';
import { stateMixin } from './stateMixin';
import { lifecyleMixin } from './lifecyle';
function Vue(options) {
   this._init(options);
}
initMixin(Vue);
renderMixin(Vue);
lifecyleMixin(Vue);
stateMixin(Vue);
export default Vue;