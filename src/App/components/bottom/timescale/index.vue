<template>
    <div class="timescale">
        <header>
            <el-input class="search" size="mini" placeholder="搜索" v-model="search" />
            <div>
                <span> {{ timer }}</span>
                <span>
                    <svg-icon @click="statusChange" :iconClass="vm_timestampStatus ? 'icon-pause' : 'icon-play'" />
                    <svg-icon @click="statusStop" iconClass="icon-stop" />
                </span>
            </div>
        </header>
        <section>
            <p>
                <span v-for="em in columnHeader" :key="em.value">
                    <template v-if="em.value === 'control'"> 控制 </template>
                    <template v-else-if="em.value === 'name'">
                        <svg-icon iconClass="icon-name" class="svg" />
                        {{ em.label }}
                    </template>
                </span>
            </p>
            <div @scroll="scrollEvent">
                <p v-for="(item, index) in mmdHelperArray" :key="index" @click="selectModule(item)" :status="vm_current.uuid === item.uuid">
                    <span v-for="em in columnHeader" :key="em.value">
                        {{ item[em.value] }}
                    </span>
                </p>
            </div>
        </section>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { PropSync, Watch } from '@/decorator';
import { computedVux } from '@/App/store/index';
// import { Watch } from '@/decorator';

// let setIntervalLoop = null;
@Options({
    name: 'timescale',
    components: {}
})
export default class App extends mixins(computedVux) {
    @PropSync('value', { required: true }) val;
    @PropSync('scrollTop', { required: true }) scroll;
    @Watch('vm_timestampStatus')
    onStatusChange(status) {
        if (window.sceneManage['mmdHelper']) {
            let helper = window.sceneManage['mmdHelper'];
            status ? helper.start() : helper.stop();
        }
    }
    // 过滤
    search = '';
    // 配置列头
    columnHeader = [
        { label: '', value: 'control' },
        { label: '名称', value: 'name' }
    ];
    // 秒格式化成时分秒
    get timer() {
        let result = parseInt(this.value);
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60);
        let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60);
        let ms = (this.value - result).toFixed(3) * 1000;
        let res = '';
        res += `${h}:`;
        res += `${m}:`;
        res += `${s}'`;
        res += ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : ms;
        return res;
    }
    // 过滤mmdHelper
    get mmdHelperArray() {
        return this.vm_structure
            .filter((em) => em.type === 'mmdHelper')
            .reduce((x, y) => {
                return [...x, ...y.children];
            }, []);
    }
    // 状态修改
    statusChange() {
        this.vm_timestampStatus = this.vm_timestampStatus ? 0 : 1;
    }
    // 停止
    statusStop() {
        this.vm_timestampStatus = 0;
        this.vm_timestamp = 0;
        this.synchronize(this.vm_timestamp);
    }
    // 选择模型
    selectModule(item) {
        this.vm_current = item;
    }
    // 滚动事件
    scrollEvent(e) {
        this.scroll = e.target.scrollTop;
    }
    // 同步动作
    synchronize(value) {
        if (window.sceneManage['mmdHelper']) {
            let helper = window.sceneManage['mmdHelper'];
            helper.synchronize(value);
        }
    }
}
</script>
<style lang="scss" scoped>
.timescale {
    user-select: none;
    width: 100%;
    height: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    header {
        background: #281928;
        display: flex;
        align-items: center;
        .search {
            ::v-deep input {
                height: 20px;
                line-height: 20px;
                border-radius: 15px;
                background: rgba(110, 110, 110, 0.75);
                color: white;
                border: none;
            }
        }
        div {
            flex: 1;
            text-align: right;
            font-size: 18px;
            padding: 0 10px;
            ::v-deep .svg-icon {
                margin-left: 6px;
                cursor: pointer;
                &:hover {
                }
            }
        }
    }
    section {
        flex: 1;
        overflow: hidden;
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        > p {
            background: #000;
            height: 20px;
            line-height: 20px;
            display: flex;
            span {
                background: #281928;
                margin-bottom: 4px;
                padding: 0 10px;
                margin-right: 2px;
                display: flex;
                align-items: center;
                &:last-of-type {
                    margin-right: 0;
                }
                &:nth-of-type(1) {
                    width: 100px;
                }
                &:nth-of-type(2) {
                    flex: 1;
                }
            }
        }
        div {
            flex: 1;
            overflow: auto;
            p {
                background: #281928;
                height: 24px;
                line-height: 24px;
                display: flex;
                cursor: pointer;
                box-sizing: border-box;
                border-bottom: 1px solid black;
                span {
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    overflow: hidden;
                    &:nth-of-type(1) {
                        width: 100px;
                    }
                    &:nth-of-type(2) {
                        flex: 1;
                    }
                }
                &[status='true'] {
                    background: #f300ff;
                }
            }
        }
    }
}
</style>
