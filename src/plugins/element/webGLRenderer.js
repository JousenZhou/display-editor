import { elementExample } from './index';
let { OutlineEffect, THREE } = require('@/main').default.Module;
import { reactive } from 'vue';
import { proxyWatch } from '../until';

export default class extends THREE.WebGLRenderer {
    // 默认配置
    default = () => {
        return {
            alpha: true,
            antialias: true,
            shadowMapEnabled: true,
            backgroundColor: '#000000',
            outlineEffect: true
        };
    };
    // 代理
    properties = {};
    // 特效件
    effect = null;
    // 继承构造函数
    constructor($el) {
        super({
            alpha: true,
            antialias: true
        });
        this.proxyProperties();
        let { alpha, antialias, shadowMapEnabled, backgroundColor, outlineEffect } = this.properties;
        let effect,
            width = $el.offsetWidth,
            height = $el.offsetHeight;
        this.alpha = alpha;
        this.antialias = antialias;
        this.shadowMap.enabled = shadowMapEnabled;
        this.setClearColor(backgroundColor);
        this.setSize(width, height);
        this.setPixelRatio(window.devicePixelRatio);
        $el.appendChild(this.domElement);
        effect = new OutlineEffect(this);
        effect.enabled = outlineEffect;
        this.effect = effect;

        console.log(this)
    }
    // 构造代理属性
    proxyProperties() {
        let properties = reactive(this.default());
        proxyWatch(properties, (value, key) => {
            if (key === 'alpha') {
                this.alpha = value;
            } else if (key === 'antialias') {
                this.antialias = value;
            } else if (key === 'shadowMapEnabled') {
                this.shadowMap.enabled = value;
            } else if (key === 'backgroundColor') {
                this.setClearColor(new THREE.Color(value));
            } else if (key === 'outlineEffect') {
                this.effect.enabled = !!value;
            }
        });
        this.properties = properties;
    }
    // 实例后绑定至example对象 以及 添加结构 还有集合管理
    example(example) {
        let object = { name: '渲染器', type: 'renderer', uuid: 'webGLRenderer', value: this, proxy: this.properties };
        let { effect } = this;
        elementExample(example, object, 'base', true);
        Object.defineProperty(example, 'effect', {
            get: function () {
                return effect;
            }
        });
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
