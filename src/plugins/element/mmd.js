import { elementExample } from './index';
// eslint-disable-next-line no-unused-vars
import { proxyWatch, treeSearchSync } from '../until';
import { reactive } from 'vue';
import _example_ from '@/plugins/example';

let uuId = 'mmdHelper';
let { MMDAnimationHelper, MMDLoader, THREE } = require('@/main').default.Module;
let loader = new MMDLoader();
// 加载MMD模型
const initMMdMesh = function (pmx, type, resource) {
    return new Promise((resolve) => {
        loader.load(
            pmx,
            (mesh) => {
                resolve({ mesh });
            },
            () => {},
            (error) => {
                console.log(error);
            },
            type,
            resource
        );
    });
};
/*加载mmd动画对象*/
const initMMdAnimation = function (url) {
    return new Promise((resolve) => {
        loader.loadVMD(url, (vmd) => {
            console.log('记载完成');
            resolve(vmd);
        });
    });
};
// 绑定摄像机动画
export const attachCameraAnimation = async function (camera, url, example = _example_) {
    let animation = await initMMdAnimation(url);
    let cameraAnimation = loader.animationBuilder.buildCameraAnimation(animation);
    if (!example['mmdHelper'].objects.get(camera)) {
        example['mmdHelper'].add(camera);
    }
    example['mmdHelper']._setupCameraAnimation(camera, cameraAnimation);
    treeSearchSync(example.dataSet.sceneStructure, camera.uuid, 'uuid').then((item) => {
        if (!Array.isArray(item.ascription)) {
            item.ascription = [];
        }
        if (!item.ascription.includes('mmdGroup')) {
            item.ascription.push('mmdGroup');
        }
        item.config = reactive({
            duration: cameraAnimation.duration
        });
    });
};
// 这个是模型
export default class {
    constructor(constructor, example, proxy = {}) {
        switch (constructor.modelType) {
            case 'mmdHelper':
                this.mmdHelper(example, proxy);
                break;
            case 'character':
                this.character(constructor, example, proxy);
                break;
            case 'scene':
                this.scene(constructor, example, proxy);
                break;
        }
    }
    // 驱动器
    mmdHelper(example, proxy) {
        if (example['mmdHelper']) {
            return;
        }
        let defaultAttr = reactive(
            Object.assign(
                {
                    cameraAnimation: false,
                    animation: false,
                    physics: true,
                    grant: true,
                    ik: true
                },
                proxy
            )
        );
        let object = new MMDAnimationHelper({ sync: true, afterglow: 2.0, resetPhysicsOnLoop: true });
        Object.keys(defaultAttr).forEach((em) => {
            object.enabled[em] = defaultAttr[em];
        });
        object.start = () => {
            object.enable('cameraAnimation', true);
            object.enable('animation', true);
        };
        object.stop = () => {
            object.enable('cameraAnimation', false);
            object.enable('animation', false);
        };
        object.synchronize = (value) => {
            let { meshes, objects, camera } = object;
            meshes.forEach((em) => {
                objects.get(em).mixer.setTime(value);
            });
            if (camera) {
                let mixer = objects.get(camera).mixer;
                mixer.setTime(value);
                mixer.update(example.clock.getDelta());
                camera.updateProjectionMatrix();
                camera.up.set(0, 1, 0);
                camera.up.applyQuaternion(camera.quaternion);
                camera.lookAt(object.cameraTarget.position);
            }
        };
        proxyWatch(defaultAttr, (value, key) => {
            if (Object.keys(object).includes(key)) {
                object.enable(key, value);
            }
        });
        let { dataSet } = example;
        // 时间轴
        example.addLoopExtra(object.uuId, () => {
            let _timestamp_ = example.clock.getDelta();
            object.update(_timestamp_);
            if (dataSet.timestampStatus) {
                dataSet.timestamp += _timestamp_;
            }
        });
        let obj = {
            name: 'MMD驱动器',
            type: 'mmd',
            pseudonym: 'mmdHelper',
            uuid: uuId,
            constructor: { modelType: 'mmdHelper' },
            value: object,
            proxy: defaultAttr,
            children: []
        };
        elementExample(example, obj, false);

        example['mmdHelper'] = object;
    }
    // 人物
    character({ url, loadType, resource }, example, proxy) {
        initMMdMesh(url, loadType, resource).then(({ mesh }) => {
            let defaultProps = {
                position: { x: 0, y: 0, z: 0 },
                animation: '',
                ikHelper: false,
                physicsHelper: false,
                castShadow: true,
                visible: true
            };

            let config = reactive({ duration: 0 });
            let properties = reactive(
                Object.keys(defaultProps).reduce((x, y) => {
                    return { ...x, [y]: '' };
                }, {})
            );
            example['mmdHelper'].add(mesh, { physics: true });
            let ikHelper = example['mmdHelper'].objects.get(mesh).ikSolver.createHelper();
            let physicsHelper = example['mmdHelper'].objects.get(mesh).physics.createHelper();

            proxyWatch(properties, async (value, key) => {
                if (key === 'ikHelper') {
                    ikHelper.visible = value;
                } else if (key === 'physicsHelper') {
                    physicsHelper.visible = value;
                } else if (key === 'visible') {
                    mesh.visible = !!value;
                } else if (key === 'castShadow') {
                    mesh.castShadow = value;
                } else if (key === 'animation') {
                    let urls = value.split(',');
                    let animation = await initMMdAnimation(urls);
                    let res = loader.animationBuilder.build(animation, mesh);
                    config.duration = res.duration.toFixed(3);
                    example['mmdHelper']._setupMeshAnimation(mesh, res);
                }
            });

            // 合并初始化属性
            Object.assign(properties, defaultProps, proxy);

            // 设置双绑定属性
            let { x, y, z } = properties.position;
            properties.position = reactive(new THREE.Vector3(x, y, z));
            delete mesh.position;
            mesh.position = properties.position;

            [mesh, ikHelper, physicsHelper].forEach((em) => {
                example.scene.add(em);
            });
            let object = {
                name: '模型',
                pseudonym: 'mmdMesh',
                type: 'mmd',
                uuid: mesh.uuid,
                value: mesh,
                proxy: properties,
                ascription: 'mmdGroup',
                constructor: { modelType: 'character', url },
                config
            };
            elementExample(example, object, 'mmdHelper', false);
        });
    }
    // 场景
    scene({ url, loadType, resource }, example, proxy) {
        initMMdMesh(url, loadType, resource).then(({ mesh }) => {
            let defaultProps = {
                position: { x: 0, y: 0, z: 0 },
                castShadow: true
            };
            let properties = reactive(
                Object.keys(defaultProps).reduce((x, y) => {
                    return { ...x, [y]: '' };
                }, {})
            );
            proxyWatch(properties, (value, key) => {
                if (key === 'castShadow') {
                    mesh.castShadow = value;
                }
            });
            // 合并初始化属性
            Object.assign(properties, defaultProps, proxy);

            let { x, y, z } = properties.position;
            properties.position = reactive(new THREE.Vector3(x, y, z));
            delete mesh.position;
            mesh.position = properties.position;

            example.scene.add(mesh);
            let object = {
                name: '场景',
                pseudonym: 'mmdScene',
                type: 'mmd',
                uuid: mesh.uuid,
                value: mesh,
                proxy: properties,
                constructor: { modelType: 'scene', url }
            };
            elementExample(example, object, false, false);
        });
    }
}
