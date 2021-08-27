import ThreeJs from './editor';
// eslint-disable-next-line no-unused-vars
let { THREE } = window;
// eslint-disable-next-line no-unused-vars
import { ambient, directional, MMdDrive, initialScene, initDragControls } from './plugins';
export default function ({ $el, $Stats }, load) {
    new ThreeJs({
        el: $el,
        stats: $Stats,
        options: {
            // 配置文件
            // cameraLookAt: { x: 0, y: 0, z: 0 },
            // cameraPosition: { x: 0, y: 400, z: 600 },
            backgroundColor: '#ffffff',
            alpha: true,
            antialias: true,
            shadowMapEnabled: true
            // plugins: {
            //     ambient: {
            //         color: '#666666'
            //     },
            //     directional: {
            //         color: '#666666',
            //         castShadow: false,
            //         position: { x: -25, y: 20, z: 25 },
            //         intensity: 0.5,
            //         distance: 0
            //     }
            // }
        },
        mounted: async function () {
            console.log(this);
            // eslint-disable-next-line no-unused-vars
            let { scene } = this;
            /*加载插件*/
            this.expandPlugin({ MMdDrive, initDragControls, initialScene });

            /** 普通场景测试*/
            let planeGeometry = new THREE.PlaneGeometry(600, 200, 1, 1);
            let planeMaterial = new THREE.MeshBasicMaterial();
            let plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 1;
            plane.position.z = 0;
            this.scene.add(plane);

            let cubeGeometry = new THREE.BoxGeometry(40, 40, 40);
            let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.position.x = -4;
            cube.position.y = 40;
            cube.position.z = 0;
            this.scene.add(cube);

            let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = 20;
            sphere.position.y = 0;
            sphere.position.z = 2;
            sphere.castShadow = true;
            this.scene.add(sphere);
            let step = 0;
            this.addLoopExtra('transform', () => {
                cube.rotation.x += 0.02;
                cube.rotation.y += 0.02;
                cube.rotation.z += 0.02;
                step += 0.03;
                sphere.position.x = 20 + 10 * Math.cos(step);
                sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
            });
            /** ~~~~~~~~~*/
            // MMD测试
            // eslint-disable-next-line no-unused-vars
            // let { loadMMdModel, loadMMdAnimation, MMdBindAnimation, loadMMdCamera, createdMMdHelper, helperRelateMMd, helperRelateCamera } = this;
            // // 挂载模型
            // // eslint-disable-next-line no-unused-vars
            // let mesh = await loadMMdModel({ pmx: 'http://127.0.0.1:3000/mmdModel/Reinhardt.pmx' });
            // mesh.position.set(0, 0, 0);
            // mesh.scale.set(10, 10, 10);
            // mesh.visible = true;
            // scene.add(mesh);
            // this.init_kms()
            // // 挂载动画[未绑定]
            // // eslint-disable-next-line no-unused-vars
            // let animation = await loadMMdAnimation({ vmdUrl: ['http://127.0.0.1:3000/mmdAnimation/action.vmd'] });
            // // 绑定动画和模型
            // // eslint-disable-next-line no-unused-vars
            // let animation_ = MMdBindAnimation(mesh, animation);
            // // 加载镜头数据
            // // eslint-disable-next-line no-unused-vars
            // let MMdCamera = await loadMMdCamera({ vmdUrl: 'http://127.0.0.1:3000/mmdCamera/camera.vmd' });
            // // 集控辅助
            // // eslint-disable-next-line no-unused-vars
            // let helper = createdMMdHelper();
            // // // 添加对象
            // helperRelateMMd(helper, mesh, animation_);
            // // helperRelateCamera(helper, MMdCamera);
            // this.addLoopExtra('mmdHelper', () => {
            //     helper.update(this.clock.getDelta());
            // });
            // // helper.start();
            // console.log(this);
            load();
        }
    });
}
