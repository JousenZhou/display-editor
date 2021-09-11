<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
@Options({
    name: 'svg-icon',
    components: {},
    props: {
        iconClass: {
            type: String,
            required: false
        },
        className: {
            type: String
        }
    }
})
export default class App extends mixins() {
    get iconName() {
        return `#icon-${this.iconClass}`;
    }
    get svgClass() {
        if (this.className) {
            return 'svg-icon ' + this.className;
        } else {
            return 'svg-icon';
        }
    }
}
</script>

<style lang="scss">
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
