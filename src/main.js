import { createApp } from 'vue';
import './registerServiceWorker';
import store from './store';
import '@/style/index.scss';

class C {
    Module = {};
    constructor() {
    }
}
let externalModule = new C();

window.onModuleLoad = function (Module) {
    externalModule.Module = Module;
    // eslint-disable-next-line no-undef
    Ammo().then(function (AmmoLib) {
        window.Ammo = AmmoLib;
        let plugins = require('@/until/plugins').default;
        let app = require('./App/index.vue').default;
        createApp(app).use(store).use(plugins).mount('#app');
    });
};

export default externalModule;
