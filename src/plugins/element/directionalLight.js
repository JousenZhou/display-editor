import { elementExample } from './index';
import { proxyWatch } from '../until';
let { THREE } = require('@/main').default.Module;
import { reactive } from 'vue';

export default class extends THREE.DirectionalLight {
    constructor(constructor, example, proxy = {}) {
        super();
        // 默认配置
        let defaultProps = {
            helperVisible: false,
            intensity: 1,
            color: '#887766',
            castShadow: true,
            distance: 0,
            visible: true
        };

        this.shadow.camera.near = 2;
        this.shadow.camera.far = 200;
        this.shadow.camera.left = -50;
        this.shadow.camera.right = 50;
        this.shadow.camera.top = 50;
        this.shadow.camera.bottom = -50;
        this.shadow.mapSize.height = 1024;
        this.shadow.mapSize.width = 1024;

        let cameraHelper = new THREE.CameraHelper(this.shadow.camera);
        let sphereLight = new THREE.SphereGeometry(1);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.copy(this.position);

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
                cameraHelper.visible = value;
                sphereLightMesh.visible = value;
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
        // let { x, y, z } = properties.position;
        // properties.position = reactive(new THREE.Vector3(x, y, z));
        // delete this.position;
        // this.position = properties.position;

        // 添加
        [this, sphereLightMesh, cameraHelper].forEach((em) => {
            example.scene.add(em);
        });

        let object = { name: '平行光', type: 'directionalLight', uuid: this.uuid, value: this, proxy: properties };
        elementExample(example, object, 'lightGroup', false);
    }
}
