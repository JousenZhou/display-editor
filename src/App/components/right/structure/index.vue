<template>
    <div class="structure">
        <el-tree ref="ElTree" :data="vm_structure" :highlight-current="true" node-key="uuid" :props="defaultProps" @node-click="handleNodeClick">
            <template #default="{ data }">
                <span class="el-tree-node__label" :id="data.uuid">{{ data.name }}</span>
            </template>
        </el-tree>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { computedVux } from '@/App/store/index';
import { Watch, Ref } from '@/decorator';

@Options({
    name: 'structure',
    components: {}
})
export default class App extends mixins(computedVux) {
    @Ref() ElTree;
    defaultProps = {
        children: 'children',
        label: 'name'
    };
    @Watch('vm_current.uuid')
    uIdChange(value) {
        this.ElTree.setCurrentKey(value);
    }
    handleNodeClick(target) {
        if (target.uuid && target.uuid !== this.vm_current.uid) {
            this.vm_current = { ...target };
        }
    }
}
</script>
<style lang="scss" scoped>
.structure {
    height: 100%;
    width: 100%;
    background: #281928;
    ::v-deep .el-tree {
        background: unset;
        .el-tree-node {
            .el-tree-node__content {
                background: unset;
                &:hover {
                    background: #ffa7fb;
                }
                .el-tree-node__label {
                    color: white;
                    font-size: 10px;
                }
            }
            .el-tree-node__children {
                background: #281928;
            }
        }
        .is-current {
            > .el-tree-node__content {
                background: violet !important;
            }
        }
    }
}
</style>
