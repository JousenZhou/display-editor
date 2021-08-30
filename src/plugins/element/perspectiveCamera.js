let { THREE } = window;
import { proxy } from '../until';

export default {
    // 初始化
    init() {
        let near = 0.1;
        let far = 100000;
        let lookAt = { x: 0, y: 0, z: 0 };
        let helperVisible = false;
        // 注册相机
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
        camera.position.set(-30, 40, 30);
        camera.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));

        // 劫持做数据映射[单向流] 映射对象到scene
        let helper = new THREE.CameraHelper(camera);
        helper.visible = helperVisible;
        // eslint-disable-next-line no-unused-vars
        let hijack = proxy(
            {
                position: camera.position,
                rotation: { ...camera.rotation },
                lookAt: { ...lookAt },
                near,
                far,
                helperVisible
            },
            // controlType 操作类型(create delete modify)
            (controlType, { target, key, value, parentKey }) => {
                target[key] = value;
                if (key === 'near') {
                    camera.near = value;
                    camera.updateProjectionMatrix();
                } else if (key === 'far') {
                    camera.far = value;
                    camera.updateProjectionMatrix();
                } else if (key === 'helperVisible') {
                    helper.visible = value;
                } else if (parentKey.includes('position')) {
                    let { x, y, z } = target;
                    camera.position.set(x, y, z);
                } else if (parentKey.includes('rotation')) {
                    let { _x, _y, _z } = target;
                    camera.rotation.set(_x, _y, _z);
                } else if (parentKey.includes('lookAt')) {
                    let { x, y, z } = target;
                    camera.lookAt(new THREE.Vector3(x, y, z));
                }
            }
        );
        return {
            camera,
            helper,
            proxy: hijack,
            loop: () => {
                helper.update();
            }
        };
    },
    // 实例
    example(Engine = window.Engine) {
        let { camera, helper, proxy, loop } = this.init();
        Engine.scene.add(helper);
        Engine.addLoopExtra(camera.uuid, loop);
        Engine.sceneStructure.push({ name: camera.uuid, type: 'camera', uuid: camera.uuid });
        Engine.sceneManage[camera.uuid] = proxy;
    }
};
