// eslint-disable-next-line no-unused-vars
import { reactive, watch } from 'vue';
let { THREE, OrbitControls, TransformControls } = require('@/main').default.Module;

import { proxyWatch } from '../until';
import _example_ from '@/plugins/example';
import { elementExample } from './index';
import { attachCameraAnimation } from './mmd';
export default class extends THREE.PerspectiveCamera {
    // 默认配置
    default = () => {
        return {
            position: reactive(new THREE.Vector3(-30, 40, 30)),
            near: 0.1,
            far: 300,
            helperVisible: false,
            animation: ''
        };
    };
    // 代理
    properties = {};
    // 辅助类
    helper = {};
    transformControlsHelper = {};
    controls = {};
    constructor(renderer) {
        super(45, renderer.offsetWidth / renderer.offsetHeight);
        this.proxyProperties();
        // eslint-disable-next-line no-unused-vars
        let { near, far, position, helperVisible } = this.properties;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
        this.lookAt(0, 0, 0);
        delete this.position;
        this.position = position;
        this.matrixWorldNeedsUpdate = true;

        // 辅助类
        let helper = new THREE.CameraHelper(this);
        helper.visible = helperVisible;
        this.helper = helper;
    }
    // 构造代理属性
    proxyProperties() {
        let properties = reactive(this.default());
        proxyWatch(properties, (value, key) => {
            if (key === 'near') {
                this.near = value;
                this.updateProjectionMatrix();
            } else if (key === 'far') {
                this.far = value;
                this.updateProjectionMatrix();
            } else if (key === 'helperVisible') {
                this.helper.visible = value;
            } else if (key === 'animation') {
                if(value){
                    attachCameraAnimation(this, value).then();
                }
            }
            /**  position 已经是双向绑定了 */
            // else if (parentKey.includes('position')) {
            //     let { x, y, z } = target;
            //     this.position.set(x, y, z);
            //     console.log(this);
            // }
        });
        this.properties = properties;
    }
    // 实例后绑定至example对象 以及 添加结构 还有集合管理
    example({ example = _example_, defineProperty = false, uuid }) {
        let { helper } = this;
        example.scene.add(helper);
        example.addLoopExtra(helper.uuid, this.helper.update.bind(this.helper));
        this.transformControlsHelper = this.transformControls(example);
        this.uuid = uuid;
        let object = {
            name: '透视相机',
            type: 'camera',
            uuid: this.uuid,
            value: this,
            proxy: this.properties,
            ascription: ['camera'],
            helperElementId: [this.transformControlsHelper.uuid, helper.uuid]
        };
        elementExample(example, object, 'cameraGroup', defineProperty);
    }
    // 绑定控制器
    transformControls(example) {
        let { renderer, scene } = example;
        let ACTION_SELECT = 1,
            ACTION_NONE = 0,
            mouse = new THREE.Vector2(),
            action = ACTION_NONE,
            rayCaster = new THREE.Raycaster(),
            controls = new OrbitControls(this, renderer.domElement),
            transformControls = new TransformControls(this, renderer.domElement),
            $el = renderer.domElement;
        controls.update();
        // 操作的时候禁止轨道控制器功能
        transformControls.addEventListener('dragging-changed', function (event) {
            controls.enabled = !event.value;
            if (!event.value && Object.hasOwnProperty.call(event.target.object, 'transformUpdate')) {
                event.target.object.transformUpdate();
            }
        });
        this.controls = controls;
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
                if (typeof current.value === 'function') {
                    let em = current.value();
                    if (em.isMesh === true) {
                        transformControls.attach(em);
                    } else {
                        transformControls.detach();
                    }
                }
            }
        );
        // 添加
        scene.add(transformControls);
        // 加入循环队列
        example.addLoopExtra(transformControls.uuid, () => {
            if (action === ACTION_SELECT) {
                rayCaster.setFromCamera(mouse, this);
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

        return transformControls;
    }
    // 重置
    reset() {
        this.transformControlsHelper.detach();
        let { helper, transformControlsHelper } = this;
        _example_.scene.add(helper);
        _example_.scene.add(transformControlsHelper);
        let { position, ...other } = this.default();
        Object.assign(this.properties, other);
        this.position.copy(position);
        this.controls.update();
    }
    // 参数加载
    loadProperties(options) {
        // 重置代理数据集合
        Object.assign(this.properties, options);
    }
}
