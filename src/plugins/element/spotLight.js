import { elementExample } from './index';
let { THREE } = require('@/main').default.Module;
import { proxyWatch } from '../until';
import { reactive } from 'vue';

export default class extends THREE.SpotLight {
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
            visible: true,
            angle: 30,
            focus: 1,
            penumbra: 1,
            decay: 1
        };

        let helper = new THREE.SpotLightHelper(this, new THREE.Color('#FF0A00'));
        let sphereLight = new THREE.SphereGeometry(0.5);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF0A00') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

        let update = function () {
            helper.update();
        };

        sphereLightMesh.transformUpdate = () => {
            this.position.copy(sphereLightMesh.position);
            update()
        };

        // 代理
        let properties = reactive(
            Object.keys(defaultProps).reduce((x, y) => {
                return { ...x, [y]: '' };
            }, {})
        );


        proxyWatch(properties, (value, key) => {
            if (key === 'helperVisible') {
                helper.visible = !!value;
                sphereLightMesh.visible = !!value;
            } else if (key === 'intensity') {
                this.intensity = value;
            } else if (key === 'color') {
                this.color = new THREE.Color(value);
            } else if (key === 'castShadow') {
                this.castShadow = !!value;
            } else if (key === 'distance') {
                this.distance = value;
                update();
            } else if (key === 'visible') {
                this.visible = !!value;
            } else if (key === 'angle') {
                this.angle = Math.PI * (value / 360);
                update();
            } else if (key === 'focus') {
                this.shadow.focus = value;
                update();
            } else if (key === 'penumbra') {
                this.penumbra = value;
            } else if (key === 'decay') {
                this.decay = value;
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

        // 添加
        [this, sphereLightMesh, helper].forEach((em) => {
            example.scene.add(em);
        });

        let object = { name: '聚光灯', type: 'spotLight', uuid: this.uuid, value: this, proxy: properties };
        elementExample(example, object, 'lightGroup', false);
    }
}
