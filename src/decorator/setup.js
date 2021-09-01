import { createDecorator } from 'vue-class-component';

export function Setup(setup) {
    return createDecorator(function (componentOptions) {
        componentOptions.setup =
            typeof setup === 'function'
                ? setup
                : function () {
                      return setup;
                  };
    });
}
