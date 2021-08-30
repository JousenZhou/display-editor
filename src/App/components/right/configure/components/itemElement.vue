<template>
    <template v-for="(item, index) in renderList">
        <div class="itemElement-list" :key="index" v-if="!item.if || displayCondition(item.if)">
            <template v-if="String(item.type) === 'array'">
                <el-collapse>
                    <el-collapse-item :title="item.label" name="collapse">
                        <itemElement v-model:list="item.children" v-model:data="renderData" />
                    </el-collapse-item>
                </el-collapse>
            </template>
            <template v-else>
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
                        size="mini"
                        v-if="String(item.type) === 'select'"
                        @change="change(item.mapping, $event)"
                        :model-value="analysis(item.mapping)"
                        placeholder="请选择"
                    >
                        <el-option v-for="em in item.options" :key="em.value" :label="em.label" :value="em.value" />
                    </el-select>
                    <el-color-picker
                        size="mini"
                        v-if="String(item.type) === 'color'"
                        @change="change(item.mapping, $event)"
                        :model-value="analysis(item.mapping)"
                        show-alpha
                    ></el-color-picker>
                    <template v-if="String(item.type) === 'input'">
                        <span class="inputElement">
                            <!--                            <el-slider :show-tooltip="false" :model-value="analysis(item.mapping)" @input="change(item.mapping, $event)" />-->
                            <el-input-number
                                :controls="false"
                                size="mini"
                                :model-value="analysis(item.mapping)"
                                @input="change(item.mapping, $event)"
                            />
                        </span>
                    </template>
                </p>
            </template>
        </div>
    </template>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { PropSync } from '@/decorator';
@Options({
    name: 'itemElement',
    components: {}
})
export default class App extends mixins() {
    collapse = 'collapse';
    @PropSync('list', { require: true }) renderList;
    @PropSync('data', { require: true }) renderData;
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
    }
    // 显示条件
    displayCondition(string) {
        let equal = string.split('=');
        return this.analysis(equal[0]) === equal[1];
    }
}
</script>
<style lang="scss" scoped>
.itemElement-list {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px black solid;
    background: #281928;
    > label {
        height: 100%;
        width: 80px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        min-height: 28px;
    }
    > p {
        flex: 1;
        ::v-deep .el-select {
            input {
                background: #6e2266;
                border-radius: 0;
                border: unset;
                color: white;
                height: 28px;
                line-height: 28px;
            }
        }
        ::v-deep .el-color-picker {
            overflow: hidden;
            display: block;
            width: 100%;
            .el-color-picker__trigger {
                width: 100%;
            }
            .el-color-picker__icon {
                display: none;
            }
        }
        .inputElement {
            display: flex;
            padding-right: 4px;
            align-items: center;
            ::v-deep .el-slider {
                flex: 1;
                height: 28px;
                margin-right: 15px;
                display: flex;
                align-items: center;
                .el-slider__bar {
                    background: #c50eff;
                }
                .el-slider__button-wrapper {
                    height: 20px;
                    width: 20px;
                    top: calc(50% - 10px);
                    .el-slider__button {
                        border-color: #c50eff;
                        height: 16px;
                        width: 16px;
                    }
                }
                .el-slider__runway {
                    margin: 0;
                }
            }
            ::v-deep .el-input-number {
                width: 60px;
                height: 20px;
                margin: 4px 0;
                .el-input {
                    height: 100%;
                    position: relative;
                    input {
                        color: white;
                        position: absolute;
                        background: black !important;
                        border-radius: 0;
                        border: unset;
                        text-align: left;
                        padding: 0;
                        text-indent: 5px;
                        height: 20px;
                        line-height: 20px;
                    }
                }
            }
        }
    }
    ::v-deep .el-collapse {
        width: 100%;
        border: unset;
        .el-collapse-item,
        .el-collapse-item__header,
        .el-collapse-item__wrap,
        .el-collapse-item__content {
            background: unset;
            border: unset !important;
            color: white;
        }
        .el-collapse-item__header {
            height: 28px;
            line-height: 28px;
            padding-left: 10px;
            border-bottom: 4px black solid !important;
        }
        .el-collapse-item__content {
            padding: 0 !important;
        }
    }
    &:last-of-type {
        border-bottom-width: 0;
    }
}
</style>
