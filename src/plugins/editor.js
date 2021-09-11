/**
 * @Description:引擎
 * @author JousenZhou
 * @date 2021/5/25 13:43
 */
import Element from './element';
import { reactive } from 'vue';
let { Detector, THREE } = require('@/main').default.Module;
export default class {
    default = () => {
        return reactive({
            proxyManage: {},
            sceneStructure: [
                { name: '基础', type: 'base', children: [] },
                { name: '摄像机', type: 'cameraGroup', children: [] },
                { name: '光源', type: 'lightGroup', children: [] }
            ],
            current: {},
            currentCameraId: 'defaultCamera',
            timestampStatus: 0,
            timestamp: 0
        });
    };
    // 根节点
    root = null;
    // 数据集合
    dataSet = this.default();
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
        new Element['perspectiveCamera'](this.renderer.domElement, 10000).example({ example: this, defineProperty: true, uuid: 'defaultCamera' });
        // 驱动器
        new Element['mmd']({ modelType: 'mmdHelper' }, this);
        this.onResize();
        this.render();
    }
    /*循环渲染*/
    render() {
        let { renderExtra, scene, camera, effect } = this;
        Object.keys(renderExtra).forEach((key) => {
            renderExtra[key]();
        });
        window.requestAnimationFrame(this.render.bind(this));
        effect.render(scene, camera);
    }
    /*动态视图窗*/
    onResize() {
        let { camera, effect, root } = this;
        window.onresize = () => {
            let { offsetWidth, offsetHeight } = root;
            camera.aspect = offsetWidth / offsetHeight;
            camera.updateProjectionMatrix();
            effect.setSize(offsetWidth, offsetHeight);
        };
    }
    /*设置循环函数*/
    addLoopExtra(key, fun) {
        let { renderExtra } = this;
        renderExtra[key] = fun;
    }
    /*添加场景管理器*/
    addSceneManage(key, object) {
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
    }
    /*重置*/
    reset() {
        // 基础类辅助uuid
        let baseElement = ['scene', 'FPS', 'defaultCamera', 'webGLRenderer'];
        // 基础类辅助uuId
        let baseHelperElement = [];
        this.dataSet.current = {};
        this.dataSet.currentCameraId = 'defaultCamera';
        this.dataSet.timestamp = 0;
        this.dataSet.timestampStatus = 0;
        delete this['mmdHelper'];
        Object.keys(this.dataSet.proxyManage).forEach((em) => {
            if (!baseElement.includes(em)) {
                delete this.dataSet.proxyManage[em];
            } else {
                let el = this.dataSet.proxyManage[em].value();
                if (typeof el.reset === 'function') {
                    el.reset();
                }
            }
        });
        function sceneStructureAnalysis(structure) {
            // eslint-disable-next-line no-unused-vars
            return structure.reduce((x, { children, ascription, config, ...item }) => {
                if (Array.isArray(children)) {
                    item.children = sceneStructureAnalysis(children);
                }
                if (!item.uuid || baseElement.includes(item.uuid)) {
                    if (Array.isArray(item.helperElementId)) {
                        baseHelperElement = [...baseHelperElement, ...item.helperElementId];
                    }
                    return [...x, item];
                }
                return x;
            }, []);
        }
        this.dataSet.sceneStructure = sceneStructureAnalysis(this.dataSet.sceneStructure);
        Object.keys(this.renderExtra).forEach((em) => {
            if (![...baseElement, ...baseHelperElement].includes(em)) {
                delete this.renderExtra[em];
            }
        });
        // 初始化MMD驱动器
        new Element['mmd']({ modelType: 'mmdHelper' }, this);
    }
    /*导出*/
    export() {
        let { sceneStructure } = this.dataSet;
        function test(structure) {
            // eslint-disable-next-line no-unused-vars
            return structure.reduce((x, { children = [], proxy, constructor, name, type, uuid }) => {
                let object = { name, type };
                if (proxy) {
                    object.proxy = JSON.parse(JSON.stringify(proxy));
                }
                if (uuid) {
                    object.uuid = uuid;
                    x = [...x, object];
                }
                // x = [...x, object];
                if (children.length) {
                    x = [...x, ...test(children)];
                }
                if (constructor) {
                    object.constructor = constructor;
                }
                return x;
            }, []);
        }

        window.ccc = JSON.stringify(test(sceneStructure));
        // console.log(JSON.stringify(test(sceneStructure)));
    }
    /*导入*/
    import() {
        this.reset();
        // eslint-disable-next-line no-unused-vars
        let baseElement = ['scene', 'FPS', 'defaultCamera', 'webGLRenderer'];
        let data = window.ccc;
        let sceneStructure = JSON.parse(data);
        sceneStructure.forEach((em) => {
            // 基础场景
            if (baseElement.includes(em.uuid)) {
                this.dataSet.proxyManage[em.uuid].value().loadProperties(em.proxy);
            } else {
                new Element[em.type](em.constructor, this, em.proxy);
            }
        });
    }
}
