import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import requireComponent from '@/until/requireContext';
const componentsMir = requireComponent(require.context('../App/components', true, /index.vue$/), 'component');
import svgIcon from './customPlugin/svg-icon/index.js';

export default {
    install: (Vue) => {
        for (let key in componentsMir) {
            Vue.component(key, componentsMir[key]);
        }
        /** 挂载插件*/
        Vue.use(ElementPlus);
        Vue.use(svgIcon);
    }
};
