import { createApp } from 'vue';
import './registerServiceWorker';
// import router from './router';
import store from './store';
import { library } from '@/library';
import { scriptLibraryHook } from '@/until/resourceLoading';
import '@/style/index.scss';
import plugins from '@/until/plugins';
scriptLibraryHook(library).then(() => {
    let app = require('./App/index.vue').default;
    createApp(app).use(store).use(plugins).mount('#app');
});
