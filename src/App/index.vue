<template>
    <div class="view-editor">
        <section>
            <left />
            <div>
                <article ref="ThreeJs" />
                <center-control />
            </div>
            <right />
        </section>
        <bottom />
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { Ref } from '@/decorator';
import example from '@/plugins/example';
import { registerVuexModule } from './store';
@Options({
    name: 'App',
    components: {}
})
export default class App extends mixins(registerVuexModule) {
    @Ref('Stats') Stats;
    @Ref('ThreeJs') ThreeJs;
    mounted() {
        example.init({
            el: this.ThreeJs,
            stats: this.ThreeJs
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
    > section {
        flex: 2.5;
        overflow: hidden;
        display: flex;
        > div {
            width: 320px;
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
                display: flex;
                flex-direction: column;
                article {
                    flex: 1;
                    overflow: hidden;
                    ::v-deep canvas {
                        width: 100% !important;
                        height: 100% !important;
                    }
                }
            }
            &:nth-of-type(3) {
                color: white;
            }
        }
    }
    > footer {
        flex: 1;
        overflow: hidden;
        /*
        box-shadow: 2px 2px 2px #666666, -2px -2px 2px #ffffff;
*/
    }
}
</style>
