import { elementExample } from './index';
let { THREE } = require('@/main').default.Module;
import { proxyWatch } from '../until';
import { reactive } from 'vue';

export default class extends THREE.AmbientLight {
    // 继承构造函数
    constructor(constructor, example, proxy = {}) {
        super();
        // 默认配置
        let defaultProps = {
            intensity: 1,
            color: '#666666',
            castShadow: false,
            visible: true
        };
        // 代理
        let properties = reactive(
            Object.keys(defaultProps).reduce((x, y) => {
                return { ...x, [y]: '' };
            }, {})
        );
        proxyWatch(properties, (value, key) => {
            if (key === 'intensity') {
                this.intensity = value;
            } else if (key === 'color') {
                this.color = new THREE.Color(value);
            } else if (key === 'castShadow') {
                this.castShadow = !!value;
            } else if (key === 'visible') {
                this.visible = !!value;
            }
        });

        // 合并初始化属性
        Object.assign(properties, defaultProps, proxy);
        example.scene.add(this);

        let object = { name: '环境光', type: 'ambientLight', uuid: this.uuid, value: this, proxy: properties };
        elementExample(example, object, 'lightGroup', false);
    }
}
