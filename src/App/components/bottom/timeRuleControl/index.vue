<template>
    <div class="time-rule-control" :status="drag !== false">
        <div>
            <!--标尺-->
            <section ref="slider">
                <p v-for="(item, index) in rule" :key="index" :style="{ flex: item.flex }" :special="item.special">
                    <span>{{ item.val }}s</span>
                </p>
                <div class="pointer" :style="{ left: `${left * 100}%` }">
                    <svg-icon iconClass="icon-point" class="svg" />
                    <span @mousedown="mousedown" />
                </div>
            </section>
            <!--内容-->
            <footer ref="container">
                <div v-for="(item, index) in mmdHelperMap" :key="index">
                    <p
                        @click="selectModule(item)"
                        :style="{ width: `${(item.config.duration / this.maxTime) * 100}%` }"
                        :status="item.uuid === current.uuid"
                    >
                        {{ item.config.duration }}
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import { Options, mixins } from 'vue-class-component';
import { Ref, PropSync, Prop, Watch, Computed } from '@/decorator';
import { computed } from '@/plugins/example';
@Options({
    name: 'timeRuleControl',
    components: {}
})
@Computed(computed(['current', 'proxyManage']))
export default class App extends mixins() {
    @Ref() slider;
    @Ref() container;
    @PropSync('value', { required: true }) val;
    @Prop({ required: true }) maxTime;
    @Prop({ required: true }) mmdHelperMap;
    @Prop({ required: true }) scrollTop;
    @Watch('scrollTop')
    onScrollTop(value) {
        this.container.scrollTop = value;
    }
    // 刻度尺
    rule = [];
    // 切成x段
    cutNumber = 14;
    // 是否已经操作
    drag = false;
    // 宽度
    width = 0;
    get left() {
        return this.val / this.maxTime;
    }
    mousedown(e) {
        this.drag = e.clientX;
        let width = this.$refs.slider.offsetWidth * this.left;
        e.stopPropagation();
        e.preventDefault();
        document.body.onmousemove = (ev) => {
            if (this.drag !== false) {
                let diff = ev.clientX - this.drag;
                this.width = width + diff;
                let val = ((this.width * this.maxTime) / this.$refs.slider.offsetWidth).toFixed(3);
                if (val > this.maxTime) {
                    this.val = parseFloat(this.maxTime);
                } else if (val < 0) {
                    this.val = 0;
                } else {
                    this.val = parseFloat(val);
                }
                this.synchronize(this.val);
            }
        };
        document.body.onmouseup = () => {
            this.drag = false;
            document.body.onmouseup = null;
        };
    }
    // 选择模型
    selectModule(item) {
        this.current = item;
    }
    // 同步动作
    synchronize(value) {
        if (this.proxyManage['mmdHelper']) {
            let helper = this.proxyManage['mmdHelper'].value();
            helper.synchronize(value);
        }
    }
    mounted() {
        // 向下取整数
        let a = Math.floor(this.maxTime / this.cutNumber);
        let overflow = this.maxTime / this.cutNumber > a;
        this.rule = new Array(overflow ? this.cutNumber + 2 : this.cutNumber + 1).fill('').map((em, index, array) => {
            return {
                val: index > this.cutNumber ? this.maxTime : a * index,
                flex: index > this.cutNumber - 1 ? ((this.maxTime - (a * index + 1)) / a) * 10 : 10,
                special: index === array.length - 2 && overflow
            };
        });
    }
}
</script>
<style lang="scss" scoped>
.time-rule-control {
    user-select: none;
    background: #281928;
    width: 100%;
    /*padding: 0 10px 10px 10px;*/
    &[status='true'] {
        cursor: e-resize;
    }
    > div {
        padding: 0 12px;
        background: #000000;
        height: calc(100%);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        section {
            display: flex;
            background: #666666;
            height: 32px;
            padding-top: 5px;
            position: relative;
            p {
                height: 24px;
                flex: 1;
                background: #281928;
                position: relative;
                display: inline-block;
                span {
                    font-size: 10px;
                    transform: scale(0.8) translateX(-50%) translateY(-2px);
                    display: inline-block;
                }
                &:last-of-type {
                    flex: unset !important;
                    width: 0;
                    span {
                        display: none;
                    }
                }
                &[special='true'] {
                    overflow: initial;
                    span {
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        transform: scale(0.8) translateX(-50%) translateY(-2px);
                    }
                }
                &:before {
                    content: '';
                    width: 1px;
                    height: 4px;
                    background: white;
                    display: block;
                    position: absolute;
                    /*left: 0;*/
                    bottom: 2px;
                    /*transform: translateX(50%);*/
                }
            }
            &:before {
                content: '';
                position: absolute;
                display: inline-block;
                /*background: #c50eff;*/
                border-top: 5px solid #c50eff;
                border-bottom: 8.5px solid #c50eff;
                left: -12px;
                top: 0;
                height: calc(100% - 13.5px);
                width: 12px;
            }
            &:after {
                content: '';
                position: absolute;
                display: inline-block;
                /*background: #c50eff;*/
                border-top: 5px solid #c50eff;
                border-bottom: 8.5px solid #c50eff;
                right: -12px;
                top: 0;
                height: calc(100% - 13.5px);
                width: 12px;
            }
            .pointer {
                position: absolute;
                height: 100%;
                transform: translateX(-50%);
                .svg {
                    position: absolute;
                    margin-top: 13px;
                    font-size: 12px;
                    z-index: 1;
                    transform: translateX(-50%);
                    left: 50%;
                    opacity: 0;
                }
                span {
                    cursor: e-resize;
                    z-index: 0;
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0.5px;
                    background: red;
                    height: 50vh;
                    display: inline-block;
                }
            }
        }
        footer {
            flex: 1;
            margin-top: 14px;
            overflow: hidden;
            div {
                height: 24px;
                width: 100%;
                p {
                    cursor: pointer;
                    height: 100%;
                    box-sizing: border-box;
                    border: 1px solid #000000;
                    color: white;
                    &[status='true'] {
                        border: 1px solid white;
                    }
                }
                &:nth-of-type(5n + 1) {
                    p {
                        background: rgb(129, 65, 226);
                    }
                }
                &:nth-of-type(5n + 2) {
                    p {
                        background: rgb(247, 124, 65);
                    }
                }
                &:nth-of-type(5n + 3) {
                    p {
                        background: rgb(121, 204, 65);
                    }
                }
                &:nth-of-type(5n + 4) {
                    p {
                        background: rgb(65, 81, 249);
                    }
                }
                &:nth-of-type(5n + 5) {
                    p {
                        background: rgb(65, 142, 231);
                    }
                }
            }
        }
    }
}
</style>
