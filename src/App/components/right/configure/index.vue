<template>
    <div class="configure">
        <itemElement v-model:list="renderList" v-model:data="renderData" />
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import itemElement from './components/itemElement';
import { Watch, Computed } from '@/decorator';
// eslint-disable-next-line no-unused-vars
import example, { computed } from '@/plugins/example';
import config from './config';
@Computed(computed(['current', 'proxyManage']))
@Options({
    name: 'configure',
    components: { itemElement }
})
export default class App extends mixins() {
    renderList = [];
    renderData = {};
    @Watch('current.uuid')
    onIdChange(uuId) {
        if (this.current.type) {
            this.renderList = config[this.current.type];
            this.renderData = this.proxyManage[uuId];
        }
    }
}
</script>
<style lang="scss" scoped>
.configure {
    height: 100%;
}
</style>
