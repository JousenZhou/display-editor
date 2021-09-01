/**
 * @Description: 深度代理proxy
 * @author JousenZhou
 * @date 2021/5/26 13:40
 */
import { createApp } from 'vue';

export const proxy = function (obj, callback, parentKey = []) {
    if (typeof obj === 'object') {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                obj[key] = proxy(obj[key], callback, [...parentKey, key]);
            }
        }
    }
    return new Proxy(obj, {
        /**
         * @param {Object, Array} target 设置值的对象
         * @param {String} key 属性
         * @param {any} value 值
         * @param {Object} receiver this
         */
        set: function (target, key, value, receiver) {
            if (typeof value === 'object') {
                value = proxy(value, callback);
            }

            let callbackType = target[key] === undefined ? 'create' : 'modify';

            // 禁止拓展属性
            if (callbackType === 'create') {
                console.error(`不允许拓展未定义属性[${key}]`);
                return true;
            }
            // 禁止修改对象内部结构
            if (
                typeof target[key] === 'object' &&
                (typeof value !== 'object' || sort(Object.keys(value)).toString() !== sort(Object.keys(target[key])).toString())
            ) {
                console.error(`不允许更改对象内部定义结构[${key}]`);
                return true;
            }
            //排除数组修改length回调
            if (!(Array.isArray(target) && key === 'length') && callback) {
                callback(callbackType, { target, key, value, parentKey });
            }
            return Reflect.set(target, key, value, receiver);
        },
        deleteProperty(target, key) {
            callback('delete', { target, key });
            return Reflect.deleteProperty(target, key);
        },
        ownKeys(target) {
            return Reflect.ownKeys(target);
        },
        get: function (target, key) {
            return target[key];
        }
    });
};
export const sort = function (arr) {
    return arr.sort(function (a, b) {
        return a.localeCompare(b);
    });
};
export const test = function (object) {
    let _ = createApp({
        data() {
            return object;
        }
    }).mount(document.createElement('div'));
    return _.$data;
};
export const treeSearch = function (array, value, key) {
    for (let a = 0; a < array.length; a++) {
        if (array[a][key] === value) {
            return array[a];
        } else if (Array.isArray(array[a].children)) {
            let res = treeSearch(array[a].children, value, key);
            if (res) {
                return res;
            }
        }
    }
};
export const treeSearchSync = function (array, value, key) {
    return new Promise((resolve, reject) => {
        let result = treeSearch(array, value, key);
        result ? resolve(result) : reject('在树结构找不到对应值');
    });
};
export const treeFilter = function (array, value, key) {
    return (array || []).reduce((x, y) => {
        if (Array.isArray(y.children)) {
            return [...x, ...treeFilter(y.children, value, key)];
        }
        if (Array.isArray(y[key]) ? y[key].includes(value) : y[key] === value) {
            return [...x, y];
        }
        return x;
    }, []);
};
