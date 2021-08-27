/**
 * @Description: 深度代理proxy
 * @author JousenZhou
 * @date 2021/5/26 13:40
 */
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
        }
    });
};
export const sort = function (arr) {
    return arr.sort(function (a, b) {
        return a.localeCompare(b);
    });
};
