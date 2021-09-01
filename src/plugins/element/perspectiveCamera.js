// eslint-disable-next-line no-unused-vars
import { reactive, watch } from 'vue';
let { THREE } = window;
import { proxy } from '../until';
import _example_ from '@/plugins/example';
import { elementExample } from './index';
import { attachCameraAnimation } from './mmd';
export default class {
    camera = '';
    helper = '';
    proxy = '';
    loop = '';
    constructor(renderer = _example_.renderer, far = 300) {
        let $el = renderer.domElement;
        let near = 0.1;
        let lookAt = { x: 0, y: 0, z: 0 };
        let helperVisible = false;
        // 注册相机
        let camera = new THREE.PerspectiveCamera(45, $el.offsetWidth / $el.offsetHeight, near, far);
        camera.position.set(-30, 40, 30);
        // 绑定位置
        // let position = reactive(camera.position.clone());
        // delete camera.position;
        // camera.position = position;

        camera.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));

        // 劫持做数据映射[单向流] 映射对象到scene
        let helper = new THREE.CameraHelper(camera);
        helper.visible = helperVisible;
        let hijack = proxy(
            {
                position: camera.position,
                rotation: camera.rotation,
                lookAt: lookAt,
                near,
                far,
                helperVisible,
                animation: ''
            },
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
                } else if (key === 'animation') {
                    attachCameraAnimation(camera, value).then();
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
        this.camera = camera;
        this.helper = helper;
        this.proxy = hijack;
        this.loop = () => {
            helper.update();
        };
    }
    example({ example = _example_, defineProperty = false }) {
        let { camera, helper, proxy, loop } = this;
        example.scene.add(helper);
        example.addLoopExtra(helper.uuid, loop);
        let object = { name: '透视相机', type: 'camera', uuid: camera.uuid, value: camera, proxy, ascription: ['camera'] };
        elementExample(example, object, 'cameraGroup', defineProperty);

        this.transformControls(example);
    }
    transformControls(example) {
        let { camera } = this;
        let { renderer, scene } = example;
        let ACTION_SELECT = 1,
            ACTION_NONE = 0,
            mouse = new THREE.Vector2(),
            action = ACTION_NONE,
            rayCaster = new THREE.Raycaster(),
            controls = new THREE.OrbitControls(camera, renderer.domElement),
            transformControls = new THREE.TransformControls(camera, renderer.domElement),
            $el = renderer.domElement;
        controls.update();
        // 操作的时候禁止轨道控制器功能
        transformControls.addEventListener('dragging-changed', function (event) {
            controls.enabled = !event.value;
            if (!event.value && Object.hasOwnProperty.call(event.target.object, 'transformUpdate')) {
                event.target.object.transformUpdate();
            }
        });
        // 鼠标事件
        renderer.domElement.addEventListener(
            'pointerdown',
            function (event) {
                action = ACTION_SELECT;
                mouse.x = (event.offsetX / $el.offsetWidth) * 2 - 1;
                mouse.y = -(event.offsetY / $el.offsetHeight) * 2 + 1;
            },
            false
        );
        watch(
            () => example.dataSet.current,
            (current) => {
                let em = current.value();
                if (em.isMesh === true) {
                    transformControls.attach(em);
                } else {
                    transformControls.detach();
                }
            }
        );
        // 添加
        scene.add(transformControls);
        // 加入循环队列
        example.addLoopExtra(transformControls.uuid, function () {
            if (action === ACTION_SELECT) {
                rayCaster.setFromCamera(mouse, camera);
                action = ACTION_NONE;
                const intersects = rayCaster.intersectObjects(
                    scene.children.filter((em) => {
                        return em.isMesh === true && !~em.type.indexOf('Helper');
                    })
                );
                if (intersects.length) {
                    transformControls.attach(intersects[0].object);
                } else {
                    // transformControls.detach();
                }
            }
        });
    }
}
