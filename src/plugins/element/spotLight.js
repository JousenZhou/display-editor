import { elementExample } from './index';
let { THREE } = window;
import { proxy } from '../until';
import _example_ from '@/plugins/example';
import { reactive } from 'vue';

export default class {
    helper = [];
    spotLight = '';
    proxy = '';
    constructor() {
        let color = '#ffffff',
            intensity = 1,
            castShadow = true,
            distance = 100,
            visible = true,
            angle = 30,
            decay = 1,
            penumbra = 1,
            focus = 1;
        // 注册场景
        let spotLight = new THREE.SpotLight(new THREE.Color(color).getStyle());
        spotLight.position.set(0, 20, 0);
        spotLight.castShadow = castShadow;
        spotLight.distance = distance;
        spotLight.intensity = intensity;
        spotLight.angle = Math.PI * (angle / 360);
        spotLight.decay = decay;
        spotLight.penumbra = penumbra;
        spotLight.shadow.focus = 1;
        // 阴影
        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;

        // 双绑定坐标
        let position = reactive(spotLight.position.clone());
        delete spotLight.position;
        spotLight.position = position;

        let helper = new THREE.SpotLightHelper(spotLight, new THREE.Color('#FF0A00'));
        helper.visible = false;
        let sphereLight = new THREE.SphereGeometry(0.5);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF0A00') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.copy(spotLight.position);
        sphereLightMesh.visible = false;
        // 阴影辅助
        let shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
        shadowCameraHelper.visible = false;
        let update = function () {
            helper.update();
            shadowCameraHelper.update();
        };

        sphereLightMesh.transformUpdate = () => {
            spotLight.position.copy(sphereLightMesh.position);
            update();
        };

        let hijack = proxy(
            {
                position: spotLight.position,
                helperVisible: false,
                intensity,
                color,
                castShadow,
                distance,
                visible,
                angle,
                focus,
                penumbra,
                decay
            },
            // eslint-disable-next-line no-unused-vars
            (controlType, { target, key, value, parentKey }) => {
                target[key] = value;
                if (key === 'helperVisible') {
                    helper.visible = value;
                    sphereLightMesh.visible = !!value;
                    // shadowCameraHelper.visible = !!value;
                } else if (key === 'intensity') {
                    spotLight.intensity = value;
                } else if (key === 'color') {
                    spotLight.color = new THREE.Color(value);
                } else if (key === 'castShadow') {
                    spotLight.castShadow = !!value;
                } else if (key === 'distance') {
                    spotLight.distance = value;
                    update();
                } else if (key === 'visible') {
                    spotLight.visible = !!value;
                } else if (key === 'angle') {
                    spotLight.angle = Math.PI * (value / 360);
                    update();
                } else if (key === 'focus') {
                    spotLight.shadow.focus = value;
                    update();
                } else if (key === 'penumbra') {
                    spotLight.penumbra = value;
                } else if (key === 'decay') {
                    spotLight.decay = value;
                } else if (parentKey.includes('position')) {
                    sphereLightMesh.position.copy(spotLight.position);
                }
            }
        );
        this.helper = [helper, sphereLightMesh, shadowCameraHelper];
        this.spotLight = spotLight;
        this.proxy = hijack;
    }
    example({ example = _example_ }) {
        let { helper, spotLight, proxy } = this;
        [...helper, spotLight].forEach((em) => {
            example.scene.add(em);
        });
        let object = { name: '聚光灯', type: 'spotLight', uuid: spotLight.uuid, value: spotLight, proxy };
        elementExample(example, object, 'lightGroup', false);
    }
}
