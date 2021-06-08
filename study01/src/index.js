import initMixin from './initMixin';
import renderMixin from './render';
import { stateMixin } from './stateMixin';
import { lifecyleMixin } from './lifecyle';
import { initGlobalApi } from './global-api';
function Vue(options) {
   this._init(options);
}
initMixin(Vue);
renderMixin(Vue);
lifecyleMixin(Vue);
stateMixin(Vue);
initGlobalApi(Vue);
export default Vue;