import { createDecorator } from 'vue-class-component';

export function Setup() {
    return createDecorator(function (componentOptions, handler) {
        let init = componentOptions.methods[handler];
        console.log(Object.getOwnPropertyNames(init));
        // console.log(init.prototype, init.constructor);
        // console.log(componentOptions, handler);
    });
}
