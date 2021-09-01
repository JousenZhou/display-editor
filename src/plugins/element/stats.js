import { elementExample } from './index';

let { Stats } = window;
import { proxy } from '../until';
export default class {
    stats = null;
    proxy = null;
    loop = null;
    constructor(Element) {
        if (Element) {
            let stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '-10px';
            stats.domElement.style.top = '-6px';
            stats.domElement.style.transform = 'scale(0.8)';
            Element.appendChild(stats.domElement);
            // 劫持做数据映射[单向流] 映射对象到scene
            let hijack = proxy(
                {
                    display: true
                },
                (controlType, { value }) => {
                    Element.children[0].style.display = value ? '' : 'none';
                }
            );
            this.stats = stats;
            this.proxy = hijack;
            this.loop = () => {
                stats.update();
            };
        } else {
            console.warn('请设置stats挂载的元素');
        }
    }
    example(example) {
        example.addLoopExtra('stats', this.loop);
        let object = { name: 'FPS', type: 'stats', uuid: 'FPS', value: this.stats, proxy: this.proxy };
        elementExample(example, object, 'base', true);
    }
}
