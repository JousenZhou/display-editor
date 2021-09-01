import { elementExample } from './index';

let { THREE } = window;
import { proxy } from '../until';
export default class {
    renderer = null;
    proxy = null;
    constructor($el) {
        let renderer,
            width = $el.offsetWidth,
            height = $el.offsetHeight;
        let hijack = proxy(
            {
                alpha: true,
                antialias: true,
                shadowMapEnabled: true,
                backgroundColor: '#000000'
            },
            (controlType, { key, value }) => {
                if (key === 'alpha') {
                    renderer.alpha = value;
                } else if (key === 'antialias') {
                    renderer.antialias = value;
                } else if (key === 'shadowMapEnabled') {
                    renderer.shadowMap.enabled = value;
                } else if (key === 'backgroundColor') {
                    renderer.setClearColor(new THREE.Color(value));
                }
            }
        );
        // 实例
        renderer = new THREE.WebGLRenderer({
            alpha: hijack.alpha,
            antialias: hijack.antialias
        });
        renderer.shadowMap.enabled = hijack.shadowMapEnabled;
        renderer.setClearColor(hijack.backgroundColor);
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        $el.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.proxy = hijack;
        console.log(renderer);
    }
    example(example) {
        let object = { name: '渲染器', type: 'renderer', uuid: 'WebGLRenderer', value: this.renderer, proxy: this.proxy };
        elementExample(example, object, 'base', true);
    }
}
