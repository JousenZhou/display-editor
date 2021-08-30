// let { THREE } = window;
// import { proxy } from '../until';
//
// export default {
//     init() {
//         // 注册场景
//         let scene = new THREE.Scene();
//         // 劫持做数据映射[单向流] 映射对象到scene
//         let hijack = proxy(
//             {},
//             // controlType 操作类型(create delete modify)
//             // eslint-disable-next-line no-unused-vars
//             (controlType, { target, key, value, parentKey }) => {}
//         );
//         return { scene, proxy: hijack };
//     }
// };

// eslint-disable-next-line no-unused-vars
import requireComponent from '@/until/requireContext';
export default requireComponent(require.context('../element', true, /\.js$/), 'script', ['index.js']);