import { elementExample } from './index';
let { THREE } = window;
import { proxy } from '../until';
import _example_ from '@/plugins/example';

export default class {
    ambientLight = '';
    proxy = '';
    constructor() {
        let color = '#000000',
            intensity = 1,
            visible = true,
            castShadow = true;

        let ambientLight = new THREE.AmbientLight(new THREE.Color(color).getStyle());
        ambientLight.castShadow = castShadow;
        ambientLight.intensity = intensity;

        let hijack = proxy(
            {
                intensity,
                color,
                castShadow,
                visible
            },
            (controlType, { target, key, value }) => {
                target[key] = value;
                if (key === 'intensity') {
                    ambientLight.intensity = value;
                } else if (key === 'color') {
                    ambientLight.color = new THREE.Color(value);
                } else if (key === 'castShadow') {
                    ambientLight.castShadow = !!value;
                } else if (key === 'visible') {
                    ambientLight.visible = !!value;
                }
            }
        );
        this.ambientLight = ambientLight;
        this.proxy = hijack;
    }
    example({ example = _example_ }) {
        let { ambientLight, proxy } = this;
        example.scene.add(ambientLight);
        let object = { name: '环境光', type: 'ambientLight', uuid: ambientLight.uuid, value: ambientLight, proxy };
        elementExample(example, object, 'lightGroup', false);
    }
}
