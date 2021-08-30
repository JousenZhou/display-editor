<template>
    <div class="right">
        <el-tabs v-model="activeLabelName">
            <el-tab-pane v-for="item in labelStructure" :key="item.value" :label="item.label" :name="item.value">
                <component :is="`right.${item.value}`" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
@Options({
    name: 'right',
    components: {}
})
export default class App extends mixins() {
    // 结构标签
    labelStructure = [
        // { label: '材质列表', value: 'material' },
        { label: '场景结构', value: 'structure' },
        { label: '目标属性', value: 'configure' }
    ];
    // 当前激活的标签
    activeLabelName = 'structure';
}
</script>
<style lang="scss" scoped>
.right {
    ::v-deep .el-tabs {
        margin: 8px;
        height: calc(100% - 16px);
        display: flex;
        flex-direction: column;
        .el-tabs__header {
            margin: 0;
            .el-tabs__nav {
                width: 100%;
                display: flex;
                .el-tabs__item {
                    height: 30px;
                    line-height: 30px;
                    flex: 1;
                    padding: 0;
                    text-align: center;
                    font-size: 12px;
                    background: #281928;
                    color: white;
                    &:nth-of-type(n + 3) {
                        border-left: 1px solid black;
                    }
                }
                .is-active {
                    color: #f300ff !important;
                }
                .el-tabs__active-bar {
                    background: rgba(243, 0, 255, 0.65);
                }
            }
        }
        .el-tabs__content {
            flex: 1;
            margin-top: 8px;
            overflow: hidden;
            .el-tab-pane {
                height: 100%;
                width: 100%;
            }
        }
    }
}
</style>
