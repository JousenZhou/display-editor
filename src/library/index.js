/**
 * @Description: 第三方插件资源库
 * @author JousenZhou
 * @date 2021/8/17 20:21
 */
const base = ['ammo.wasm', 'Detector', 'stats', 'dat.gui'];
const mmd = [];
const control = [];
export const library = [
    ...base.map((em) => `./library/${em}.js`),
    ...control.map((em) => `./library/control/${em}.js`),
    ...mmd.map((em) => `./library/mmd/${em}.js`)
];
