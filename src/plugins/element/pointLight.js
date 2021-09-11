import { elementExample } from './index';
let { THREE } = require('@/main').default.Module;
import { proxyWatch } from '../until';
import { reactive } from 'vue';

export default class extends THREE.PointLight {
    constructor(constructor, example, proxy = {}) {
        super();
        // 默认配置
        let defaultProps = {
            position: { x: 0, y: 20, z: 0 },
            helperVisible: false,
            intensity: 1,
            color: '#ffffff',
            castShadow: true,
            distance: 100,
            visible: true
        };

        let helper = new THREE.PointLightHelper(this, 15, new THREE.Color('#FF0A00'));
        let sphereLight = new THREE.SphereGeometry(0.5);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF0A00') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

        sphereLightMesh.transformUpdate = () => {
            this.position.copy(sphereLightMesh.position);
        };

        // 代理
        let properties = reactive(
            Object.keys(defaultProps).reduce((x, y) => {
                return { ...x, [y]: '' };
            }, {})
        );

        proxyWatch(properties, (value, key) => {
            if (key === 'helperVisible') {
                helper.visible = value;
                sphereLightMesh.visible = !!value;
            } else if (key === 'intensity') {
                this.intensity = value;
            } else if (key === 'color') {
                this.color = new THREE.Color(value);
            } else if (key === 'castShadow') {
                this.castShadow = !!value;
            } else if (key === 'distance') {
                this.distance = value;
            } else if (key === 'visible') {
                this.visible = !!value;
            }
        });

        // 合并初始化属性
        Object.assign(properties, defaultProps, proxy);

        // 设置双绑定属性
        let { x, y, z } = properties.position;
        properties.position = reactive(new THREE.Vector3(x, y, z));
        delete this.position;
        this.position = properties.position;

        sphereLightMesh.position.copy(this.position);

        [helper, this, sphereLightMesh].forEach((em) => {
            example.scene.add(em);
        });

        let object = { name: '点光源', type: 'pointLight', uuid: this.uuid, value: this, proxy: properties };
        elementExample(example, object, 'lightGroup', false);
    }
}
