<template>
    <div class="baseElement">
        <el-collapse accordion v-model="activeNames">
            <el-collapse-item v-for="(item, index) in list" :key="index" :name="index">
                <template #title>
                    <header>
                        <i :class="activeNames === index ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
                        <i :class="item.icon" />
                        <span>{{ item.name }}</span>
                    </header>
                </template>
                <div class="item" v-for="(em, indexOf) in item.children" :key="indexOf">
                    <article @click="control(em)"><i :class="item.icon" /></article>
                    <span>{{ em.name }}</span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { computedVux } from '@/App/store/index';
// eslint-disable-next-line no-unused-vars
import { Watch, Ref } from '@/decorator';
@Options({
    name: 'baseElement',
    components: {}
})
export default class App extends mixins(computedVux) {
    list = [
        {
            name: '相机',
            icon: 'el-icon-camera-solid',
            children: [{ type: 'perspectiveCamera', name: '透视相机' }]
        }
    ];
    activeNames = '';
    control(item) {
        if (this.vm_Element[item.type]) {
            this.vm_Element[item.type].example();
        }
    }
}
</script>
<style lang="scss" scoped>
.baseElement {
    height: 100%;
    width: 100%;
    ::v-deep .el-collapse {
        border: none;
        .el-collapse-item {
            margin-bottom: 10px;
            background: #281928;
            border: none;
            .el-collapse-item__header,
            .el-collapse-item__wrap {
                background: unset;
                color: white;
                border: none;
            }
            .el-collapse-item__header {
                height: 40px;
                > i {
                    display: none;
                }
                header {
                    padding: 0 10px;
                    i {
                        &:nth-of-type(2) {
                            color: #c50eff;
                            margin: 0 4px;
                        }
                    }
                }
            }
            .el-collapse-item__content {
                padding: 0 10px 10px 10px;
                .item {
                    margin-bottom: 10px;
                    cursor: pointer;
                    float: left;
                    width: calc(50% - 5px);
                    height: 90px;
                    color: white;
                    &:nth-of-type(2n + 1) {
                        margin-right: 10px;
                    }
                    article {
                        background: #432d43;
                        height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        &:hover {
                            background: #ffa7fb;
                        }
                    }
                    span {
                        margin-top: 6px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>
