<template>
    <div class="center-control">
        <span @click="exportJSON" style="color: white">导出</span>
        <span @click="importJSON" style="color: white">导入</span>
        <span @click="reset" style="color: white">重置</span>

        <el-select size="mini" v-model="currentCameraId" placeholder="请选择" @change="cameraChange">
            <el-option v-for="item in cameraSet" :key="item.uuid" :label="item.name" :value="item.uuid"> </el-option>
        </el-select>
    </div>
</template>

<script>
import { treeFilter } from '@/plugins/until';
import { Options, mixins } from 'vue-class-component';
import { Computed } from '@/decorator';
import example, { computed } from '@/plugins/example';
@Options({
    name: 'center',
    components: {}
})
@Computed(computed(['sceneStructure', 'currentCameraId', 'proxyManage']))
export default class App extends mixins() {
    options = [];
    // 相机集合
    get cameraSet() {
        return treeFilter(this.sceneStructure, 'camera', 'ascription');
    }
    // 修改主题相机
    cameraChange(uuId) {
        example.camera = this.proxyManage[uuId].value();
    }
    // 导出
    exportJSON() {

        example.export();
    }
    importJSON(){
        example.import();
    }
    // 重置
    reset() {
        example.reset();
    }
}
</script>
<style lang="scss" scoped>
.center-control {
    height: 28px;
    display: flex;
    background: #281928;
    align-items: center;
    justify-content: space-between;
    color: white;
    border: 1px solid #281928;
    ::v-deep .el-select {
        input {
            height: 28px;
            background: black;
            color: white;
            border: none;
            border-radius: 0;
        }
    }
}
</style>
