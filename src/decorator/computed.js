import { createDecorator } from 'vue-class-component';
export function Computed(computed) {
    return createDecorator(function (componentOptions) {
        Object.assign(componentOptions.computed, computed);
    });
}
