import { computedVuxModule, registerVuexModuleWith } from '@/store/registerVuexModule';
const vuxModule = {
    // 命名空间
    namespaced: true,
    state: {
        // 当前目标对象
        current: '',
        // 时间
        timestamp: 0,
        // 时间状态  // 状态 0 = 暂停 1 = 播放
        timestampStatus: 0,
        // 场景集合
        proxyManage: {},
        // 场景结构
        sceneStructure: [],
        // 元素
        Element: []
    },
    mutations: {},
    actions: {}
};
export const registerVuexModule = registerVuexModuleWith(vuxModule);
export const computedVux = computedVuxModule(vuxModule.state);
