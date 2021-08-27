let { Stats } = window;
import { proxy } from '../until';

export default {
    init(Element) {
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
            return {
                stats,
                proxy: hijack,
                loop: () => {
                    stats.update();
                }
            };
        }
        console.warn('请设置stats挂载的元素');
        return { stats: null, proxy: null, loop: () => {} };
    }
};
