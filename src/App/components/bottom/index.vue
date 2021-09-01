<template>
    <footer>
        <bottom.timescale v-model:mmdHelperMap="mmdHelperArray" v-model:value="timestamp" v-model:scrollTop="scrollTop" />
        <bottom.time-rule-control v-model:mmdHelperMap="mmdHelperArray" v-model:value="timestamp" :maxTime="300" :scrollTop="scrollTop" />
    </footer>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { treeFilter } from '@/plugins/until';
import { Computed } from '@/decorator';
import { computed } from '@/plugins/example';
@Options({
    name: 'bottom',
    components: {}
})
@Computed(computed(['sceneStructure', 'timestamp']))
export default class App extends mixins() {
    scrollTop = 0;
    // 过滤mmdHelper
    get mmdHelperArray() {
        return treeFilter(this.sceneStructure, 'mmdGroup', 'ascription');
    }
}
</script>
<style lang="scss" scoped>
footer {
    color: white;
    display: flex;
    height: 100%;
    padding-bottom: 10px;
    > div {
        height: 100%;
        &:nth-of-type(1) {
            flex: 1;
            margin-right: 10px;
        }
        &:nth-of-type(2) {
            flex: 2.2;
        }
        overflow: hidden;
    }
}
</style>
