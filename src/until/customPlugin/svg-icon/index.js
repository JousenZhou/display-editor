import SvgIcon from './index.vue';
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('@/svg', false, /\.svg$/);
requireAll(req);
export default {
    install: (Vue) => {
        Vue.component('svg-icon', SvgIcon);
    }
};