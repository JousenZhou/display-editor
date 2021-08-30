let { THREE } = window;
import { proxy } from '../until';

export default {
    init(options) {
        let {
            alpha = false,
            antialias = false,
            shadowMapEnabled = false,
            backgroundColor = '#ffffff',
            width = window.innerWidth,
            height = window.innerHeight
        } = options;
        // 实例
        let renderer = new THREE.WebGLRenderer({
            alpha,
            antialias
        });
        renderer.shadowMap.enabled = shadowMapEnabled;
        renderer.setClearColor(backgroundColor);
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // 劫持做数据映射[单向流] 映射对象到scene
        let hijack = proxy(
            {
                alpha,
                antialias,
                shadowMapEnabled,
                backgroundColor
            },
            // controlType 操作类型(create delete modify)
            // eslint-disable-next-line no-unused-vars
            (controlType, { target, key, value, parentKey }) => {
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
        return { renderer, proxy: hijack };
    }
};
