/**
 * @Description:引擎
 * @author JousenZhou
 * @date 2021/5/25 13:43
 */
let { THREE, Detector } = window;
import store from '@/store';
import Element from './element';
export default class {
    // 根节点
    root = null;
    // 场景管理器[对象式]
    sceneManage = {};
    // 渲染拓展函数对象存储
    renderExtra = {};
    // 时序
    clock = new THREE.Clock();
    // 场景结构
    sceneStructure = [];
    mounted = function (func, ...other) {
        func.bind(this)(THREE, ...other);
    };
    /*构造函数*/
    constructor({ el, stats, options, namespaced }) {
        // 绑定store
        let { sceneManage, sceneStructure } = store.state[namespaced];
        store.state[namespaced].Element = Element;
        this.sceneManage = sceneManage;
        this.sceneStructure = sceneStructure;
        // 根节点
        this.root = el;
        // 浏览器校验 true 则 启动threeJs
        this.browserSupport({ ...options, stats });
    }
    /*浏览器支持校验*/
    browserSupport(options) {
        !Detector.webgl
            ? (() => {
                  let warnings = document.createElement('div');
                  warnings.style.cssText =
                      'line-height: 24px;' +
                      'font-size: 16px ;' +
                      'text-height:100px;' +
                      'width:500px;position:' +
                      'relative;left:calc(50% - 250px);' +
                      'text-align:center;' +
                      'background:F9F9F9;' +
                      'margin-top: 200px;';

                  warnings.innerHTML =
                      '你的浏览器内核版本过低或者不支持WebGL,请更换Chrome（谷歌）、IE9（或以上）、Edge。若你是双核浏览器（如Uc、360等）,请切换核心进行刷新!';
                  this.root.appendChild(warnings);
              })()
            : (() => {
                  this.createScene(options);
              })();
    }
    /*创建场景*/
    createScene(options) {
        // 场景
        let { scene, proxy: sceneDate } = Element['scene'].init();
        // 加载FPS插件
        let { stats, proxy: statsDate, loop: statsLoop } = Element['stats'].init(options.stats);
        this.addLoopExtra('stats', statsLoop);
        // 渲染器
        let { renderer, proxy: rendererDate } = Element['webGLRenderer'].init(options);

        // 环境光
        // let color = `#${new THREE.Color('#ffffff').getHexString()}`;
        // let ambientLight = new THREE.AmbientLight(new THREE.Color(color).getStyle());
        // scene.add(ambientLight);
        // 默认相机
        let { camera, helper, proxy: cameraDate } = Element['perspectiveCamera'].init();
        scene.add(helper);

        this.sceneStructure.push({ name: '基础', children: [] });
        [
            { name: '场景', type: 'scene', uuid: 'scene', value: scene, proxy: sceneDate },
            { name: '渲染器', type: 'renderer', uuid: 'WebGLRenderer', value: renderer, proxy: rendererDate },
            { name: 'FPS', type: 'stats', uuid: 'FPS', value: stats, proxy: statsDate },
            // { name: '环境光', type: 'ambientLight', uuid: ambientLight.uuid, value: ambientLight },
            { name: '默认相机', type: 'camera', uuid: 'camera', value: camera, proxy: cameraDate }
        ].forEach((em) => {
            this.sceneManage[em.uuid] = em.proxy || em.value;
            let { name, type, uuid } = em;
            this.sceneStructure[0].children.push({ name, type, uuid });
            // 劫持映射
            Object.defineProperty(this, em.type, {
                get: function () {
                    return em.value;
                }
            });
        });
        this.onResize();
        this.root.appendChild(renderer.domElement);
        this.render();
    }
    /*循环渲染*/
    render() {
        let { renderExtra, scene, camera, renderer } = this;
        Object.keys(renderExtra).forEach((key) => {
            renderExtra[key]();
        });
        window.requestAnimationFrame(this.render.bind(this));
        renderer.render(scene, camera);
    }
    /*动态视图窗*/
    onResize() {
        let { camera, renderer } = this;
        window.onresize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
    }
    /*设置循环函数*/
    addLoopExtra(key, fun) {
        let { renderExtra } = this;
        renderExtra[key] = fun;
    }
    /*添加场景管理器*/
    // eslint-disable-next-line no-unused-vars
    addSceneManage(key, object) {
        // let { sceneManage } = this;
        // if (Object.keys(sceneManage).includes(key)) {
        //     console.error(`检测出场景管理仓已存在相同[${key}]对象,当前key值设置为${key}_`);
        //     sceneManage[`${key}_`] = object;
        //     return true;
        // }
        // sceneManage[key] = object;
    }
    /*拓展插件*/
    expandPlugin(plugins) {
        Object.keys(plugins).forEach((name) => {
            let plugin = plugins[name];
            this.plugins = this.plugins || {};
            this.plugins[name] = {};
            let init = false;
            Object.getOwnPropertyNames(plugin.prototype).forEach((prop) => {
                if (!/^constructor$/.test(prop)) {
                    this.plugins[name][prop] = plugin.prototype[prop].bind(this);
                    // 这里做个映射
                    if (prop === 'init') {
                        init = plugin.prototype[prop].bind(this);
                    } else {
                        Object.defineProperty(this, prop, {
                            get: () => {
                                return plugin.prototype[prop].bind(this);
                            }
                        });
                    }
                }
            });
            init && init(name);
        });
    }
}
