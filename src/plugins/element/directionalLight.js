import { elementExample } from './index';
let { THREE } = window;
import { proxy } from '../until';
import _example_ from '@/plugins/example';

export default class {
    helper = [];
    directionalLight = '';
    proxy = '';
    constructor() {
        let color = '#ffffff',
            intensity = 1,
            castShadow = true,
            distance = 0;
        // 注册场景
        let directionalLight = new THREE.DirectionalLight(new THREE.Color(color).getStyle());
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = castShadow;
        directionalLight.shadowCameraNear = 2;
        directionalLight.shadowCameraFar = 200;
        directionalLight.shadowCameraLeft = -50;
        directionalLight.shadowCameraRight = 50;
        directionalLight.shadowCameraTop = 50;
        directionalLight.shadowCameraBottom = -50;
        directionalLight.shadowCameraVisible = true;
        directionalLight.distance = distance;
        directionalLight.intensity = intensity;
        directionalLight.shadowMapHeight = 1024;
        directionalLight.shadowMapWidth = 1024;
        let cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        cameraHelper.visible = false;
        let sphereLight = new THREE.SphereGeometry(1);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.copy(directionalLight.position);
        sphereLightMesh.visible = false;

        sphereLightMesh.transformUpdate = () => {
            directionalLight.position.copy(sphereLightMesh.position);
        };

        let hijack = proxy(
            {
                helperVisible: false,
                intensity,
                color,
                castShadow,
                distance,
                visible : true,
            },
            // eslint-disable-next-line no-unused-vars
            (controlType, { target, key, value, parentKey }) => {
                target[key] = value;
                if (key === 'helperVisible') {
                    cameraHelper.visible = value;
                    sphereLightMesh.visible = value;
                } else if (key === 'intensity') {
                    directionalLight.intensity = value;
                } else if (key === 'color') {
                    directionalLight.color = new THREE.Color(value);
                } else if (key === 'castShadow') {
                    directionalLight.castShadow = !!value;
                } else if (key === 'distance') {
                    directionalLight.distance = value;
                } else if (key === 'visible') {
                    directionalLight.visible = !!value;
                }
            }
        );
        this.helper = [cameraHelper, sphereLightMesh];
        this.directionalLight = directionalLight;
        this.proxy = hijack;
    }
    example({ example = _example_ }) {
        let { helper, directionalLight, proxy } = this;
        [...helper, directionalLight].forEach((em) => {
            example.scene.add(em);
        });
        let object = { name: '平行光', type: 'directionalLight', uuid: directionalLight.uuid, value: directionalLight, proxy };
        elementExample(example, object, 'lightGroup', false);
    }
}
