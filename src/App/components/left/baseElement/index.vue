<template>
    <div class="baseElement">
        <el-collapse :accordion="false" v-model="activeNames">
            <el-collapse-item v-for="(item, index) in renderList" :key="index" :name="index">
                <template #title>
                    <header>
                        <i :class="activeNames === index ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
                        <i :class="item.icon" />
                        <span>{{ item.name }}</span>
                        <label @click="item.import(item)" v-if="item.import">导入</label>
                    </header>
                </template>
                <div class="item" v-for="(em, indexOf) in item.children" :key="indexOf">
                    <article @click="control(em, item)"><i :class="item.icon" /></article>
                    <span>{{ em.name }}</span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { Prop } from '@/decorator';
import Element from '@/plugins/element';

@Options({
    name: 'baseElement',
    components: {}
})
export default class App extends mixins() {
    @Prop({ required: true }) renderList;
    activeNames = '';
    control(em, item) {
        if (Element[em.type]) {
            new Element[em.type]().example({ param: em.param, ...item.param|| {} });
        }
    }
    // importTest() {
    //     let el = document.createElement('input');
    //     el.setAttribute('type', 'file');
    //     el.setAttribute('directory', 'true');
    //     el.setAttribute('webkitdirectory', 'true');
    //     el.onchange = function () {
    //         // console.log(e);
    //         // let resource = {};
    //         // Array.from(el.files).forEach((em, index) => {
    //         //     resource[em.webkitRelativePath] =
    //         //     console.log(index,em);
    //         //     // if (index === 0) {
    //         //     //     let blob = new Blob([em], { type: em.type });
    //         //     //     let blobURL = window.URL.createObjectURL(blob);
    //         //     //     new Element['mmd']().example({ param: blobURL });
    //         //     // }
    //         // });
    //         new Element['mmd']().example({ param: 'miku.pmx', loadType: 'blob', resource: Array.from(el.files) });
    //     };
    //     el.click();
    // }
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
                    width: calc(33% - 6px);
                    height: 90px;
                    color: white;
                    &:nth-of-type(3n + 3) {
                        margin-right: unset;
                    }
                    margin-right: 10px;
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
