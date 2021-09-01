import { createApp } from 'vue';
import './registerServiceWorker';
// import router from './router';
import store from './store';
import { library } from '@/library';
import { scriptLibraryHook } from '@/until/resourceLoading';
import '@/style/index.scss';
scriptLibraryHook(library).then(() => {
    let plugins = require('@/until/plugins').default;
    let app = require('./App/index.vue').default;
    createApp(app).use(store).use(plugins).mount('#app');
});
