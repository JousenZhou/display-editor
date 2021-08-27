<template>
    <footer>
        <bottom.timescale v-model:value="vm_timestamp" v-model:scrollTop="scrollTop" />
        <bottom.time-rule-control v-model:value="vm_timestamp" :maxTime="300" :scrollTop="scrollTop" />
    </footer>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { computedVux } from '@/App/store/index';
@Options({
    name: 'bottom',
    components: {}
})
export default class App extends mixins(computedVux) {
    scrollTop = 0;
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
