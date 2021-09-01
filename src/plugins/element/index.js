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

// 元素
export const elementExample = function (example, object, parentType, defineProperty = false) {
    let { sceneStructure } = example.dataSet;
    let item = {
        ...object,
        value: () => {
            return object.value;
        }
    };
    if (parentType !== false) {
        let index = sceneStructure.findIndex((em) => em.type === parentType);
        if (~index) {
            sceneStructure[index].children.push(item);
        }
    } else {
        sceneStructure.push(item);
    }
    example.addSceneManage(object.uuid, { proxy: object.proxy, value: object.value });
    if (defineProperty) {
        Object.defineProperty(example, object.type, {
            get: function () {
                return object.value;
            },
            set: function (value) {
                object.value = value;
            }
        });
    }
};
