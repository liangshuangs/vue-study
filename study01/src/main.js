import Vue from './index';
import store from './store';
export const vm = new Vue({
    data: {
        message: 'hello',
    },
    store,
    el: '#app'
});