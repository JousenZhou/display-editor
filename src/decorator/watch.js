import { createDecorator } from 'vue-class-component';
import { nextTick } from 'vue';

export function Watch(path, options) {
    if (options === void 0) {
        options = {};
    }
    let _a = options.deep,
        deep = _a === void 0 ? false : _a,
        _b = options.immediate,
        immediate = _b === void 0 ? false : _b;
    return createDecorator(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        let watch = componentOptions.watch;
        if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
            watch[path] = [watch[path]];
        } else if (typeof watch[path] === 'undefined') {
            watch[path] = [];
        }
        watch[path].push({ handler: handler, deep: deep, immediate: immediate });
    });
}

export function WatchMounted(path, options) {
    if (options === void 0) {
        options = {};
    }
    return createDecorator(function (componentOptions, handler) {
        const mounted = componentOptions.mounted || new Function();

        function mergeFunction(Function) {
            if (Function) {
                return function () {
                    mounted.apply(this);
                    Function(this);
                };
            }
            return mounted;
        }

        componentOptions.mounted = mergeFunction(async (Vue) => {
            await nextTick();
            Vue.$watch(path, Vue[handler], options);
        });
    });
}
