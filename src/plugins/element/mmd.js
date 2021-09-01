import { elementExample } from './index';
let { THREE } = window;
import { proxy, treeSearchSync } from '../until';
import { reactive } from 'vue';
let loader = new THREE.MMDLoader();
import _example_ from '@/plugins/example';
let uuId = 'mmdHelper';
let helperExample;
// MMD模型
const initMMdMesh = function (pmx, type, resource) {
    return new Promise((resolve) => {
        loader.load(
            pmx,
            (mesh) => {
                console.log('mesh',mesh);
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
            console.log('记载完成')
            resolve(vmd);
        });
    });
};
// 驱动
export const initMmdHelper = function (example) {
    let sync = true,
        features = {
            cameraAnimation: false,
            animation: false,
            physics: true,
            grant: true,
            ik: true
        },
        afterglow = 2,
        resetPhysicsOnLoop = true,
        helper = new THREE.MMDAnimationHelper({ sync, afterglow, resetPhysicsOnLoop });
    Object.keys(features).forEach((em) => {
        helper.enabled[em] = features[em];
    });
    helper.start = () => {
        helper.enable('cameraAnimation', true);
        helper.enable('animation', true);
    };
    helper.stop = () => {
        helper.enable('cameraAnimation', false);
        helper.enable('animation', false);
    };
    helper.synchronize = (value) => {
        let { meshes, objects, camera } = helper;
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
            camera.lookAt(helper.cameraTarget.position);
        }
    };
    // 劫持做数据映射[单向流] 映射对象到scene
    let hijack = proxy(features, (controlType, { key, value }) => {
        if (Object.keys(features).includes(key)) {
            helper.enable(key, value);
        }
    });
    let { dataSet } = example;
    // 时间轴
    example.addLoopExtra(uuId, () => {
        let _timestamp_ = example.clock.getDelta();
        helper.update(_timestamp_);
        if (dataSet.timestampStatus) {
            dataSet.timestamp += _timestamp_;
        }
    });
    let object = { name: 'MMD驱动器', type: 'mmdHelper', uuid: uuId, value: helper, proxy: hijack, children: [] };
    elementExample(example, object, false);
    helperExample = helper;
};
// 绑定摄像机动画
export const attachCameraAnimation = async function (camera, url, example = _example_) {
    let animation = await initMMdAnimation(url);
    let cameraAnimation = loader.animationBuilder.buildCameraAnimation(animation);
    if (!helperExample.objects.get(camera)) {
        helperExample.add(camera);
    }
    helperExample._setupCameraAnimation(camera, cameraAnimation);
    treeSearchSync(example.dataSet.sceneStructure, camera.uuid, 'uuid').then((item) => {
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
    example({ example = _example_, param, loadType, resource, modelType }) {
        console.log(modelType);
        if (modelType === 'mmd-character') {
            this.character(example, param, loadType, resource);
        } else if (modelType === 'mmd-scene') {
            this.scene(example, param, loadType, resource);
        }
    }
    // 人物
    character(example, url, loadType, resource) {
        if (helperExample) {
            initMMdMesh(url, loadType, resource).then(({ mesh }) => {

                console.log(mesh);

                // 双绑定坐标
                let position = reactive(mesh.position.clone());
                delete mesh.position;
                mesh.position = position;

                let ikHelper, physicsHelper;
                let config = reactive({ duration: 0 });
                let hijack = proxy(
                    {
                        position: mesh.position,
                        animation: '',
                        ikHelper: false,
                        physicsHelper: false,
                        castShadow: true
                    },
                    async (controlType, { target, key, value, parentKey }) => {
                        if (key === 'ikHelper') {
                            ikHelper.visible = value;
                        } else if (key === 'physicsHelper') {
                            physicsHelper.visible = value;
                        } else if (key === 'castShadow') {
                            mesh.castShadow = value;
                        } else if (key === 'animation') {
                            let urls = value.split(',');
                            let animation = await initMMdAnimation(urls);
                            let res = loader.animationBuilder.build(animation, mesh);
                            let duration = res.duration.toFixed(3);
                            mesh.duration = duration;
                            config.duration = duration;
                            helperExample._setupMeshAnimation(mesh, res);
                        } else if (parentKey.includes('position')) {
                            target[key] = value;
                            let { x, y, z } = target;
                            mesh.position.set(x, y, z);
                        }
                    }
                );
                helperExample.add(mesh);
                mesh.castShadow = hijack.castShadow;
                // 骨骼辅助
                ikHelper = helperExample.objects.get(mesh).ikSolver.createHelper();
                ikHelper.visible = hijack.ikHelper;
                //物理刚体辅助
                physicsHelper = helperExample.objects.get(mesh).physics.createHelper();
                physicsHelper.visible = hijack.physicsHelper;

                [mesh, ikHelper, physicsHelper].forEach((em) => {
                    example.scene.add(em);
                });
                // console.log(JSON.stringify(mesh.toJSON()).length);
                let object = { name: '模型', type: 'mmdMesh', uuid: mesh.uuid, value: mesh, proxy: hijack, ascription: 'mmdGroup', config };
                elementExample(example, object, 'mmdHelper', false);
            });
        }
    }
    // 场景
    scene(example, url, loadType, resource) {
        initMMdMesh(url, loadType, resource).then(({ mesh }) => {
            // 双绑定坐标
            let position = reactive(mesh.position.clone());
            delete mesh.position;
            mesh.position = position;

            let hijack = proxy(
                {
                    position: mesh.position,
                    castShadow: true
                },
                async (controlType, { target, key, value, parentKey }) => {
                    if (key === 'castShadow') {
                        mesh.castShadow = value;
                    } else if (parentKey.includes('position')) {
                        target[key] = value;
                        let { x, y, z } = target;
                        mesh.position.set(x, y, z);
                    }
                }
            );
            example.scene.add(mesh);
            let object = { name: '场景', type: 'mmdScene', uuid: mesh.uuid, value: mesh, proxy: hijack };
            elementExample(example, object, false, false);
        });
    }
}
