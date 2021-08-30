<template>
    <div class="configure">
        <itemElement v-model:list="renderList" v-model:data="renderData" />
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import itemElement from './components/itemElement';
import { computedVux } from '@/App/store/index';
import { Watch } from '@/decorator';
// eslint-disable-next-line no-unused-vars
import config from './config';
@Options({
    name: 'configure',
    components: { itemElement }
})
export default class App extends mixins(computedVux) {
    renderList = [];
    renderData = {};
    @Watch('vm_current.uuid')
    onIdChange(uuId) {
        if (this.vm_current.type) {
            this.renderList = config[this.vm_current.type];
            this.renderData = this.vm_sceneManage[uuId];
        }
    }
}
</script>
<style lang="scss" scoped>
.configure {
    height: 100%;
}
</style>
