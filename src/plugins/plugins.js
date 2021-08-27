let { THREE } = window;
// 环境光
export const ambient = class {
    init(pluginName) {
        let { THREE } = window;
        let { scene } = this;
        let {  color = '#ffffff' } = this.options?.plugins[pluginName] ?? {};
        color = `#${new THREE.Color(color).getHexString()}`;
        let ambientLight = new THREE.AmbientLight(new THREE.Color(color).getStyle());
        scene.add(ambientLight);
        this.addSceneManage(pluginName, ambientLight);
    }
};
// 半球光
export const directional = class {
    init(pluginName) {
        let { THREE } = window;
        let {
            color = '#ffffff',
            castShadow = false,
            position = {},
            helper = true,
            intensity,
            distance = 0
        } = this.options?.plugins[pluginName] ?? {};
        color = `#${new THREE.Color(color).getHexString()}`;
        let { x: px = 0, y: py =400, z: pz = 600 } = position;
        let { scene } = this;
        let directionalLight = new THREE.DirectionalLight(new THREE.Color(color).getStyle());
        directionalLight.position.set(px, py, pz);
        directionalLight.castShadow = castShadow;
        directionalLight.intensity = intensity;
        directionalLight.distance = distance;
        // 阴影修复
        directionalLight.shadow.mapSize.x = 2048;
        directionalLight.shadow.mapSize.y = 2048;
        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.bias = -0.001;
        // 光线辅助类
        let cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        let sphereLight = new THREE.SphereGeometry(1);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.castShadow = castShadow;
        sphereLightMesh.position.copy(directionalLight.position);
        // 添加光线辅助骨架
        if (helper) {
            scene.add(cameraHelper);
            scene.add(sphereLightMesh);
        }
        scene.add(directionalLight);
        this.addSceneManage(pluginName, directionalLight);
    }
};
// MMD驱动
export const MMdDrive = class {
    /*加载mmd对象*/
    loadMMdModel({ pmx, name = `MMD模型-${new Date().getTime()}` }) {
        let loader = new THREE.MMDLoader();
        return new Promise((resolve) => {
            loader.load(pmx, (mesh) => {
                this.addSceneManage(name, mesh);
                resolve(mesh);
            });
        });
    }
    /*加载mmd动画对象*/
    loadMMdAnimation({ vmdUrl, name = `MMD动画[未绑定]-${new Date().getTime()}` }) {
        let loader = new THREE.MMDLoader();
        return new Promise((resolve) => {
            loader.loadVMD(vmdUrl, (vmd) => {
                this.addSceneManage(name, vmd);
                resolve(vmd);
            });
        });
    }
    /*MMD绑定动画*/
    MMdBindAnimation(mesh, animation) {
        let loader = new THREE.MMDLoader();
        return loader.animationBuilder.build(animation, mesh);
    }
    /*绑定镜头数据*/
    loadMMdCamera({ vmdUrl, name = `MMD镜头-${new Date().getTime()}` }) {
        let loader = new THREE.MMDLoader();
        return new Promise((resolve) => {
            loader.loadVMD(vmdUrl, (vmd) => {
                let result = loader.animationBuilder.buildCameraAnimation(vmd);
                this.addSceneManage(name, result);
                resolve(result);
            });
        });
    }
    /*创建MMD集控管理*/
    createdMMdHelper(object, name = `MMD驱动-${new Date().getTime()}`) {
        let { sync = true, afterglow = 2, resetPhysicsOnLoop = true } = object || {};
        let helper = new THREE.MMDAnimationHelper({ sync, afterglow, resetPhysicsOnLoop });
        helper.enabled['cameraAnimation'] = false;
        helper.enabled['animation'] = false;
        helper.enabled['physics'] = true;
        helper.enabled['grant'] = true;
        helper.enabled['ik'] = true;
        this.addSceneManage(name, helper);
        helper.start = () => {
            helper.enable('cameraAnimation', true);
            helper.enable('animation', true);
        };
        helper.stop = () => {
            helper.enable('cameraAnimation', false);
            helper.enable('animation', false);
        };
        helper.synchronize = (value) => {
            let { meshes, objects } = helper;
            meshes.forEach((em) => {
                objects.get(em).mixer.setTime(value);
            });
        };
        return helper;
    }
    /*Helper关联MMD*/
    helperRelateMMd(helper, mesh, animation) {
        let { scene } = this;
        helper.add(mesh, {
            animation: animation,
            physics: true
        });
        // 骨骼辅助
        let ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
        ikHelper.visible = true;
        scene.add(ikHelper);
        //物理刚体辅助
        let physicsHelper = helper.objects.get(mesh).physics.createHelper();
        physicsHelper.visible = true;
        scene.add(physicsHelper);
    }
    /*helper关联镜头*/
    helperRelateCamera(helper, cameraAnimation) {
        let { camera } = this;
        helper.add(camera, {
            animation: cameraAnimation
        });
    }
};
// // 轨道摄像机
// export const
// 初始场景
export const initialScene = class {
    init() {
        let { scene } = this;
        // 添加平面辅助
        let helper = new THREE.GridHelper(900, 30, 0xcd3700, 0x4a4a4a);
        scene.add(helper);
    }
};
// 为模型绑定拖拽
export const initDragControls = class {
    init_kms() {
        // eslint-disable-next-line no-unused-vars
        let { scene, camera, renderer } = this;
        let controls = new THREE.TrackballControls(camera, renderer.domElement);
        let transformControls = new THREE.TransformControls(camera, renderer.domElement);
        // transformControls.setMode('translate');
        // transformControls.setMode('rotate');
        // transformControls.setMode('scale');

        scene.add(transformControls);
        let object = [];
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].isMesh) {
                object.push(scene.children[i]);
            }
        }
        // 初始化拖拽控件
        let dragControls = new THREE.DragControls(object, camera, renderer.domElement);
        // 鼠标略过
        dragControls.addEventListener('hoveron', function (event) {
            transformControls.attach(event.object);
        });
        // 开始拖拽
        dragControls.addEventListener('dragstart', function () {
            controls.enabled = false;
        });
        // 拖拽结束
        dragControls.addEventListener('dragend', function () {
            controls.enabled = true;
        });
        this.addLoopExtra('dragControls', () => {
            controls.update();
        });
    }
};
