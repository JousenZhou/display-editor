// eslint-disable-next-line no-unused-vars
import { initDragControls, initialScene, MMdDrive, ambient, directional } from '@/plugins/plugins';
// import { useStore } from 'vuex';
// eslint-disable-next-line no-unused-vars
export default async function (THREE, Vue) {
    this.expandPlugin({ MMdDrive, initDragControls });
    // eslint-disable-next-line no-unused-vars
    let { loadMMdModel, loadMMdAnimation, MMdBindAnimation, loadMMdCamera, createdMMdHelper, helperRelateMMd, helperRelateCamera } = this;
    // eslint-disable-next-line no-unused-vars
    let { scene } = this;
    // 模拟
    let helper = createdMMdHelper({}, 'mmdHelper');

    this.sceneStructure.push({ name: 'MMD-Helper', type: 'mmdHelper', children: [], uuid: 'MMdHelp' });
    // let mesh = await loadMMdModel({ pmx: 'http://127.0.0.1:3000/mmdModel/Reinhardt.pmx' });
    // mesh.position.set(0, 0, 0);
    // mesh.scale.set(10, 10, 10);
    // mesh.visible = true;
    // scene.add(mesh);
    // let animation = await loadMMdAnimation({ vmdUrl: ['http://127.0.0.1:3000/mmdAnimation/action.vmd'] });
    // let animation_ = MMdBindAnimation(mesh, animation);
    // helperRelateMMd(helper, mesh, animation_);
    // mesh.duration = animation_.duration;
    // this.sceneStructure[1].children.push({ name: '莱茵哈特', type: mesh.type, uuid: mesh.uuid, config: { duration: mesh.duration } });

    this.addLoopExtra('mmdHelper', () => {
        let _ = this.clock.getDelta();
        helper.update(_);
        if (Vue.vm_timestampStatus) {
            Vue.vm_timestamp += _;
        }
    });

    // var spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(-40, 400, -10);
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    // this.addLoopExtra('timestamp', () => {
    //     if (Vue.vm_timestampStatus) {
    //         // if (this.clock.running === false) {
    //         //     this.clock.start();
    //         // }
    //         Vue.vm_timestamp += this.clock.getDelta();
    //     }
    //     // else {
    //     //     this.clock.stop();
    //     // }
    // });

    // console.log(helper, mesh, animation, animation_);
    //
    // console.log(helper);
    //
    // helper.start();
    // helper.update(0);
    // setTimeout(() => {
    //     this.clock.stop();
    //     this.clock.elapsedTime = 0
    // }, 3000);
    this.init_kms();
    // /** 普通场景测试*/
    // let planeGeometry = new THREE.PlaneGeometry(600, 200, 1, 1);
    // var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    // let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.receiveShadow = true;
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 15;
    // plane.position.y = 1;
    // plane.position.z = 0;
    // this.scene.add(plane);
    //
    // let cubeGeometry = new THREE.BoxGeometry(40, 40, 40);
    // let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    // let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.castShadow = true;
    // cube.position.x = -4;
    // cube.position.y = 40;
    // cube.position.z = 0;
    // this.scene.add(cube);
    //
    // let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    // let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.x = 20;
    // sphere.position.y = 0;
    // sphere.position.z = 2;
    // sphere.castShadow = true;
    // this.scene.add(sphere);
    // let step = 0;
    // this.addLoopExtra('transform', () => {
    //     cube.rotation.x += 0.02;
    //     cube.rotation.y += 0.02;
    //     cube.rotation.z += 0.02;
    //     step += 0.03;
    //     sphere.position.x = 20 + 10 * Math.cos(step);
    //     sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
    // });

    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    this.camera.position.x = -30;
    this.camera.position.y = 40;
    this.camera.position.z = 30;
    this.camera.lookAt(scene.position);


    for (let a = 0; a < 30; a++) {
        var cubeSize = Math.ceil(Math.random() * 3);
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        // position the cube randomly in the scene
        cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);

        // add the cube to the scene
        scene.add(cube);
    }
}
