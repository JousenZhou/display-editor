import { elementExample } from './index';
let { Stats } = require('@/main').default.Module;
import { proxyWatch } from '../until';
import { reactive } from 'vue';
export default class {
    stats = new Stats();
    default = () => {
        return {
            display: true
        };
    };
    properties = null;
    constructor(Element) {
        let { stats } = this;
        stats.setMode(0);
        Object.assign(stats.domElement.style, {
            width: '100px',
            position: 'absolute',
            right: '-10px',
            left: 'unset',
            top: '-6px',
            transform: 'scale(0.8)'
        });
        Element.appendChild(stats.domElement);
        this.proxyProperties();
    }
    // 构造代理属性
    proxyProperties() {
        let { stats } = this;
        let properties = reactive(this.default());
        proxyWatch(properties, (value, key) => {
            if (key === 'display') {
                Object.assign(stats.domElement.style, {
                    display: value ? '' : 'none'
                });
            }
        });
        this.properties = properties;
    }
    // 实例后绑定至example对象 以及 添加结构 还有集合管理
    example(example) {
        example.addLoopExtra('FPS', this.stats.update.bind(this.stats));
        let object = { name: 'FPS', type: 'stats', uuid: 'FPS', value: this, proxy: this.properties };
        elementExample(example, object, 'base', true);
    }
    // 重置
    reset() {
        // 重置代理数据集合
        Object.assign(this.properties, this.default());
    }
    // 参数加载
    loadProperties(options) {
        // 重置代理数据集合
        Object.assign(this.properties, options);
    }
}
