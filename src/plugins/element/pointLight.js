import { elementExample } from './index';
let { THREE } = window;
import { proxy } from '../until';
import _example_ from '@/plugins/example';
import { reactive } from 'vue';

export default class {
    helper = [];
    pointLight = '';
    proxy = '';
    constructor() {
        let color = '#ffffff',
            intensity = 1,
            castShadow = true,
            distance = 100,
            visible = true;
        // 注册场景
        let pointLight = new THREE.PointLight(new THREE.Color(color).getStyle());
        pointLight.position.set(0, 20, 0);
        pointLight.castShadow = castShadow;
        pointLight.distance = distance;
        pointLight.intensity = intensity;
        // 双绑定坐标
        let position = reactive(pointLight.position.clone());
        delete pointLight.position;
        pointLight.position = position;

        let helper = new THREE.PointLightHelper(pointLight, 15, new THREE.Color('#FF0A00'));
        helper.visible = false;
        let sphereLight = new THREE.SphereGeometry(0.5);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF0A00') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.copy(pointLight.position);
        sphereLightMesh.visible = false;

        sphereLightMesh.transformUpdate = () => {
            pointLight.position.copy(sphereLightMesh.position);
        };

        let hijack = proxy(
            {
                position: pointLight.position,
                helperVisible: false,
                intensity,
                color,
                castShadow,
                distance,
                visible
            },
            // eslint-disable-next-line no-unused-vars
            (controlType, { target, key, value, parentKey }) => {
                target[key] = value;
                if (key === 'helperVisible') {
                    helper.visible = value;
                    sphereLightMesh.visible = !!value;
                } else if (key === 'intensity') {
                    pointLight.intensity = value;
                } else if (key === 'color') {
                    pointLight.color = new THREE.Color(value);
                } else if (key === 'castShadow') {
                    pointLight.castShadow = !!value;
                } else if (key === 'distance') {
                    pointLight.distance = value;
                } else if (key === 'visible') {
                    pointLight.visible = !!value;
                } else if (parentKey.includes('position')) {
                    sphereLightMesh.position.copy(pointLight.position);
                }
            }
        );
        this.helper = [helper, sphereLightMesh];
        this.pointLight = pointLight;
        this.proxy = hijack;
    }
    example({ example = _example_ }) {
        let { helper, pointLight, proxy } = this;
        [...helper, pointLight].forEach((em) => {
            example.scene.add(em);
        });
        let object = { name: '点光源', type: 'pointLight', uuid: pointLight.uuid, value: pointLight, proxy };
        elementExample(example, object, 'lightGroup', false);
    }
}
