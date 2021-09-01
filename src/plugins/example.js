import editor from './editor';
// eslint-disable-next-line no-unused-vars
import { reactive, ref } from 'vue';
// import { reactive } from 'vue';
const example = new editor();
import { initMmdHelper } from './element/mmd';
// eslint-disable-next-line no-unused-vars
import ElementDirectionalLight from './element/directionalLight';

// 数据集合
let dataSet = Object.assign(example.dataSet, {
    current: {},
    currentCameraId: '',
    timestampStatus: 0,
    timestamp: 0
});
// computed 双向绑定 引擎数据集合与Vue组件
const computed = function (keyAttrs) {
    return keyAttrs.reduce((x, y) => {
        return {
            ...x,
            [y]: {
                get: function () {
                    return dataSet[y];
                },
                set: function (value) {
                    dataSet[y] = value;
                }
            }
        };
    }, {});
};

// 脚本
// eslint-disable-next-line no-unused-vars
example.mounted = function (THREE) {
    // 设置相机当前默认Id
    dataSet.currentCameraId = this.camera.uuid;
    // 初始化MMD驱动器
    initMmdHelper(this);
    // 添加平行光
    // new ElementDirectionalLight().example({ example: this });
    // setTimeout(() => {
    //     this.sceneStructure.push({ name: 'xxx' });
    // }, 3000);
    // eslint-disable-next-line no-unused-vars
    // let { scene } = this;
    // var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    // var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.receiveShadow = true;
    //
    // // rotate and position the plane
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 0;
    // plane.position.y = 0;
    // plane.position.z = 0;
    //
    // // add the plane to the scene
    // scene.add(plane);
    //
    // // eslint-disable-next-line no-unused-vars
    // var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // scene.add(ambientLight);
};
export default example;
export { computed };
