<!--<template>-->
<!--    <div />-->
<!--</template>-->

<!--<script>-->
<!--    import { Options, mixins } from 'vue-class-component';-->
<!--    @Options({-->
<!--        name: 'itemElement',-->
<!--        components: {}-->
<!--    })-->
<!--    export default class App extends mixins() {}-->
<!--</script>-->
<!--<style lang="scss" scoped></style>-->

declare const NaN: number;
declare const Infin <div v-for="(item, index) in renderList" :key="index">
    <label>{{ item.label }}</label>
    <p>
        <el-switch
                v-if="String(item.type) === 'switch'"
                @change="change(item.mapping, $event)"
                :value="analysis(item.mapping)"
                active-color="#f300ff"
                inactive-color="#dcdcdc"
        />
        <el-select
                v-if="String(item.type) === 'select'"
                @change="change(item.mapping, $event)"
                :model-value="analysis(item.mapping)"
                placeholder="请选择"
        >
            <el-option v-for="em in item.options" :key="em.value" :label="em.label" :value="em.value" />
        </el-select>
    </p>
</div>
</div>
</template>

<script>
    import { Options, mixins } from 'vue-class-component';
    import { computedVux } from '@/App/store/index';
    import { Watch } from '@/decorator';
    import config from './config';
    @Options({
        name: 'configure',
        components: {xport const ERROR: number;
    /**@deprecated*/ export consprecated*/ export const KEYDOWN: number;
    /**@deprecated*/ export const KEYPRESS: number;
    /**@deprecated*/ export const KEYUP: number;
    /**@deprecated*/ export const LOAD: number;
    /**@deprecated*/ export const MOU: number;

    // 解析
    analysis(mapping) {
        return mapping.split('.').reduce((x, y) => {
            return x[y];
        }, this.renderData);
    }
    // 修改
    change(mapping, value) {
        let _ = this.renderData;
        return mapping.split('.').forEach((em, index, array) => {
            if (array.length - 1 === index) {
                _[em] = value;
            } else {
                _ = _[em];
            }
        });
    } /**@deprecated*/ export const MOUSEMOVE: number;
    /**@deprecated*/ export const MOU
    background: #281928;
    > div {
        padding: 5px 10px;
        height: 20px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        label {
            width: 80px;
        }
        p {
            flex: 1;
        }
    }deprecated*/