let { THREE } = require('@/main').default.Module;
import { elementExample } from './index';
import { proxyWatch } from '../until';
import { reactive } from 'vue';

export default class extends THREE.Scene {
    // 默认配置
    default = () => {
        return {
            // false | fog | fogExp2
            enabled: false,
            // 雾 (远近)
            fog: {
                color: 'rgba(255,255,255,1)',
                near: 0.015,
                far: 100
            },
            // 雾 (浓度)
            fogExp2: {
                color: 'rgba(255,255,255,1)',
                concentration: 0.01
            }
        };
    };
    // 代理
    properties = {};
    // 继承构造函数
    constructor() {
        super();
        this.proxyProperties();
    }
    // 构造代理属性
    proxyProperties() {
        let properties = reactive(this.default());
        proxyWatch(properties, (value, key, parentKey, target) => {
            if (key === 'enabled') {
                if (value === false) {
                    this.fog = null;
                } else if (value === 'fog') {
                    let { color, near, far } = properties.fog;
                    this.fog = new THREE.Fog(new THREE.Color(color), near, far);
                } else if (value === 'fogExp2') {
                    let { color, concentration } = properties.fogExp2;
                    this.fog = new THREE.FogExp2(new THREE.Color(color), concentration);
                }
            } else if (parentKey.includes('fog')) {
                let { color, near, far } = target;
                this.fog = new THREE.Fog(new THREE.Color(color), near, far);
            } else if (parentKey.includes('fogExp2')) {
                let { color, concentration } = target;
                this.fog = new THREE.FogExp2(new THREE.Color(color), concentration);
            }
        });
        this.properties = properties;
    }
    // 实例后绑定至example对象 以及 添加结构 还有集合管理
    example(example) {
        let object = { name: '场景', type: 'scene', uuid: 'scene', value: this, proxy: this.properties };
        elementExample(example, object, 'base', true);
    }
    // 重置
    reset() {
        // 清空场景数据
        this.clear();
        // 重置代理数据集合
        Object.assign(this.properties, this.default());
    }
    // 参数加载
    loadProperties(options) {
        // 重置代理数据集合
        Object.assign(this.properties, options);
    }
}
