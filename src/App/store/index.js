import { computedVuxModule, registerVuexModuleWith } from '@/store/registerVuexModule';
const vuxModule = {
    // 命名空间
    namespaced: true,
    state: {
        structure: [],
        current: '',
        // 时间
        timestamp: 0,
        // 时间状态  // 状态 0 = 暂停 1 = 播放
        timestampStatus: 0
    },
    mutations: {},
    actions: {}
};
export const registerVuexModule = registerVuexModuleWith(vuxModule);
export const computedVux = computedVuxModule(vuxModule.state);
