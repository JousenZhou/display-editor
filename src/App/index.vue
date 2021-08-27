<template>
    <div class="view-editor">
        <section>
            <left />
            <div ref="ThreeJs" />
            <right />
        </section>
        <bottom />
    </div>
</template>

<script>
// import { useStore } from 'vuex';
import { Options, mixins } from 'vue-class-component';
import { Ref } from '@/decorator';
import ThreeJs from '@/plugins/editor';
import example2 from '@/plugins/example2';
import { registerVuexModule } from './store';
@Options({
    name: 'App',
    components: {}
})
export default class App extends mixins(registerVuexModule) {
    @Ref('Stats') Stats;
    @Ref('ThreeJs') ThreeJs;
    mounted() {
        let this_ = this;
        // eslint-disable-next-line no-unused-vars
        let example = new ThreeJs({
            el: this.ThreeJs,
            stats: this.ThreeJs,
            structure: this.vm_structure,
            options: {
                backgroundColor: '#ffffff',
                alpha: true,
                antialias: true,
                shadowMapEnabled: true
            },
            mounted: function (THREE) {
                example2.bind(this)(THREE, this_);
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.view-editor {
    font-family: 'PingFang SC', serif;
    font-size: 12px;
    background: black;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    section {
        flex: 2.5;
        overflow: hidden;
        display: flex;
        > div {
            width: 280px;
            &:nth-of-type(1) {
                /*
                box-shadow: -2px 2px 2px #666666, 2px -2px 2px #ffffff;
*/
            }
            &:nth-of-type(2) {
                margin: 10px;
                flex: 1;
                overflow: hidden;
                position: relative;
                ::v-deep canvas {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
            &:nth-of-type(3) {
                color: white;
                /*
                box-shadow: 2px 2px 2px #666666, -2px -2px 2px #ffffff;
*/
            }
        }
    }
    footer {
        flex: 1;
        overflow: hidden;
        /*
        box-shadow: 2px 2px 2px #666666, -2px -2px 2px #ffffff;
*/
    }
}
</style>
