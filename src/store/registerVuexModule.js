/**
 * @Description: 模块动态注册/销毁
 * @author BloodCat(JousenZhou)
 * @date 2020/12/24
 */
let ModuleId = 'threeJs';
import { Options, mixins } from 'vue-class-component';
// 加参形态【注册】[通常用于index组件]
function registerVuexModuleWith(store = {}) {
    function getRegisterModule() {
        let registerModule_ = {
            namespaced: true,
            state: {},
            mutations: {},
            actions: {}
        };
        let computed = {};
        // 解析store结构
        let allowKey = ['state', 'mutations', 'actions', 'namespaced'];
        try {
            Object.keys(store).forEach((em) => {
                if (allowKey.includes(em)) {
                    Object.assign(registerModule_[em], store[em]);
                } else {
                    throw `不支持${em}关键字`;
                }
            });
            // 根据state构建mutations
            Object.keys(registerModule_.state).forEach((em) => {
                let mutations = registerModule_.mutations;
                Object.assign(mutations, {
                    [`SET${em.replace('v_', '').toUpperCase()}`]: function(stats, value) {
                        stats[em] = value;
                    }
                });
                Object.assign(computed, {
                    [`vm_${em.replace('v_', '')}`]: {
                        get: function() {
                            return this.$store.state[this.routerModuleId][em];
                        },
                        set: function(value) {
                            this.$store.commit(`${this.routerModuleId}/SET${em.replace('v_', '').toUpperCase()}`, value);
                        }
                    }
                });
            });
        } catch (e) {
            console.error('模块注入store结构异常', e);
        }
        return { registerModule_, computed };
    }
    const { registerModule_, computed } = getRegisterModule();
    // 深拷贝state
    @Options({ computed })
    class registerVuexModule extends mixins() {
        routerModuleId = ModuleId;
        // 动态设置set/get函数
        created() {
            this.$store.registerModule(this.routerModuleId.toString(), {
                ...registerModule_,
                state: JSON.parse(JSON.stringify(registerModule_.state))
            });
        }
        beforeDestroy() {
            this.$store.unregisterModule(this.routerModuleId);
        }
    }
    return registerVuexModule;
}
//双绑computed【模块内通用组件共享】
function computedVuxModule(state = {}) {
    let computed = {};
    Object.keys(state).forEach((em) => {
        Object.assign(computed, {
            [`vm_${em.replace('v_', '')}`]: {
                get: function() {
                    return this.$store.state[this.routerModuleId][em];
                },
                set: function(value) {
                    this.$store.commit(`${this.routerModuleId}/SET${em.replace('v_', '').toUpperCase()}`, value);
                }
            }
        });
    });
    @Options({ computed })
    class computedModule extends mixins() {
        routerModuleId = ModuleId;
    }
    return computedModule;
}
export { registerVuexModuleWith, computedVuxModule };
