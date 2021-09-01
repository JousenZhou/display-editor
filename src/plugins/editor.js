/**
 * @Description:引擎
 * @author JousenZhou
 * @date 2021/5/25 13:43
 */
let { THREE, Detector } = window;
import Element from './element';
import { reactive } from 'vue';
export default class {
    // 根节点
    root = null;
    // 数据集合
    dataSet = reactive({
        proxyManage: {},
        sceneStructure: [
            { name: '基础', type: 'base', children: [] },
            { name: '摄像机', type: 'cameraGroup', children: [] },
            { name: '光源', type: 'lightGroup', children: [] }
        ]
    });
    sceneManage = {};
    // 渲染拓展函数对象存储
    renderExtra = {};
    // 时序
    clock = new THREE.Clock();
    // 启动脚本
    mounted = new Function();
    /*构造函数*/
    constructor() {}
    // 实例运行
    init({ el, stats }) {
        // 根节点
        this.root = el;
        // 浏览器校验 true 则 启动threeJs
        this.browserSupport({ stats });
        this.mounted(THREE);
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
        new Element['scene']().example(this);
        // 加载FPS插件
        new Element['stats'](options.stats).example(this);
        // 渲染器
        new Element['webGLRenderer'](this.root).example(this);
        // 默认相机
        new Element['perspectiveCamera'](this.renderer,10000).example({ example: this, defineProperty: true });
        this.onResize();
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
        let { camera, renderer, root } = this;
        window.onresize = () => {
            let { offsetWidth, offsetHeight } = root;
            camera.aspect = offsetWidth / offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(offsetWidth, offsetHeight);
        };
    }
    /*设置循环函数*/
    addLoopExtra(key, fun) {
        let { renderExtra } = this;
        renderExtra[key] = fun;
    }
    /*添加场景管理器*/
    addSceneManage(key, object) {
        let { sceneManage } = this;
        let { proxyManage } = this.dataSet;
        if (Object.keys(proxyManage).includes(key)) {
            console.error(`检测出场景管理仓已存在相同[${key}]对象,当前key值设置为${key}_`);
            key = `${key}_`;
        }
        proxyManage[key] = object.proxy;
        Object.defineProperty(proxyManage[key], 'value', {
            get: function () {
                return function () {
                    return object.value;
                };
            }
        });
        sceneManage[key] = object.value;
    }
}
