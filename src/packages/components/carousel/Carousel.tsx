import { computed, defineComponent, h, provide, renderSlot, ref, getCurrentInstance, onMounted, CSSProperties, PropType, watch, onUnmounted } from 'vue'
import IndicatorItem from './indicator'
import './style/index.css'
import Icon from '../icon'
interface Props {
    count: number;
    style: CSSProperties;
    options: object;
}

export default defineComponent({
    name: 'Carousel',
    components: { Icon },
    props: {
        options: {
            type: Object,
            default: () => ({
                "duration": 2000,
                'autoPlay': true,
                "type": 'row',
                "indicator": true,
                "moveTime": 1000,
                'flip': true,
            })
        },

    },
    setup(props, ctx) {

        const uid: any = ref([])
        const uidIndicator: any = ref([])
        function getUid<T>(v: T): void {
            uid.value.push(v)
        }
        provide('getUid', getUid)
        function getUidIndicator<T>(v: T): void {
            uidIndicator.value.push(v)
        }
        provide('getUidIndicator', getUidIndicator)
        provide('uid', uid)
        const instance: any = getCurrentInstance()


        const index = ref(0)
        let t: any
        const isT = ref(false)
        const isP = ref('') // 是否显示复制的节点
        const carouselBox = ref('w-carouselBox')
        const carousel = ref('w-carousel')
        function setTr() { // 修改复制节点的状态
            if (props.options.type == 'column') {
                isP.value = 'w-carousel-p_c_t'
            } else {
                isP.value = 'w-carousel-p_r_t'
            }

        }
        // 定时
        const autoPlay = () => {
            if (props.options.autoPlay) {
                clearInterval(t)
                t = setInterval(() => {
                    if (uid.value.length - 1 > index.value) {
                        index.value++
                    } else {
                        index.value = 0
                    }
                }, props.options.duration || 2000);
            };
        }
        const style: any = ref('')
        provide('index', index)
        // 获取指示器的uid
        function getIndicator(uidS: any) {
            console.log(uidIndicator.value.indexOf(uidS));

            index.value = uidIndicator.value.indexOf(uidS) || 0
        }
        provide('getIndicator', getIndicator)
        function indicator(i: any) {
            // setTr()
            if (i * 1 >= 0 && i * 1 <= uid.value.length - 1) {
                index.value = i
            }
        }
        // 监听
        watch(index, (v) => {

            if (props.options.type == 'row') {
                style.value = `transform: translate3d(-${instance?.refs.carousel.clientWidth * (v >= 0 ? v : 0)}px, 0px, 0px);transition-duration: ${props.options.moveTime || 1000}ms`
            } else {
                style.value = `transform: translate3d(0px, -${instance?.refs.carousel.clientHeight * (v >= 0 ? v : 0)}px, 0px);transition-duration: ${props.options.moveTime || 1000}ms;`
            }
            // }

        })
        // 样式
        const cls: any = computed(() => {
            let s = []
            if (props.options.type == 'column') {
                s.push('w-carousel-column')
            }
            return {
                class: s
            }
        })
        const isFlipUp = ref('none')
        const isFlipDown = ref('none')
        let ts: any
        // 鼠标移出
        function mouseLeave(e: any) {
            // index.value = 0
            isFlipUp.value = 'none'
            isFlipDown.value = 'none'
            cancelAnimationFrame(ts)
            ts = requestAnimationFrame(autoPlay)
            document.onmousemove = null
            e.preventDefault()
        }
        const right = ref()
        const left = ref()
        // 鼠标移入
        function mouseover(e: any) {
            cancelAnimationFrame(ts)
            clearInterval(t)

            if (props.options.flip) {
                if (index.value > 0) {
                    isFlipDown.value = 'block'
                } else {
                    isFlipDown.value = 'none'
                }
                if (index.value < uid.value.length - 1) {
                    isFlipUp.value = 'block'
                } else {
                    isFlipUp.value = 'none'
                }

            } else {
                isFlipUp.value = 'none'
                isFlipDown.value = 'none'
            }

            e.preventDefault()
        }
        function start() {
            cancelAnimationFrame(ts)
            // clearInterval(t)
            var ts: any = requestAnimationFrame(autoPlay)
            // autoPlay()
            indicatorS()
            if (props.options.flip) {
                if (props.options.type == 'row') {
                    right.value = ['w-carousel_right_left', 'w-carousel-right_r']
                    left.value = ['w-carousel_right_left', 'w-carousel-left_r']
                } else {
                    right.value = ['w-carousel_right_left', 'w-carousel-right_c']
                    left.value = ['w-carousel_right_left', 'w-carousel-left_c']
                }
            }
        }
        onMounted(() => {
            // let firstElementChild = instance.refs.carouselBox.firstElementChild.cloneNode(true)
            // instance.refs.carouselP.appendChild(firstElementChild)
            clearInterval(t)
            cancelAnimationFrame(ts)
            start()
        })
        onUnmounted(() => {
            clearInterval(t)
        })
        const indicatorContent: any = ref('')
        function indicatorItem() {
            return uid.value.map((item: any, i: Number) => {
                return <IndicatorItem item={i} ></IndicatorItem>
            })
        }

        function indicatorS() {
            if (props.options.indicator) {
                // console.log(indicatorItem());

                indicatorContent.value = <div class={props.options.type == 'row' ? 'w-indicator w-indicator_r' : 'w-indicator w-indicator_c'}>{indicatorItem()}</div>
            } else {
                indicatorContent.value = ''
            }
        }


        // 鼠标按下
        function startFn(e: any) {
            clearInterval(t)
            cancelAnimationFrame(ts)
            document.onmousemove = function (ev: any) {
                if (props.options.type == 'row') {
                    let en = instance?.refs.carousel.clientWidth * index.value + (e.offsetX - ev.offsetX)
                    if (e.offsetX - ev.offsetX > 0) {
                        if (Math.abs(e.offsetX - ev.offsetX) > 10) {
                            if (index.value < uid.value.length - 1)
                                index.value++

                            document.onmousemove = null
                        } else {
                            if (index.value < uid.value.length - 1) {
                                style.value = `transform: translate3d(-${en}px, 0px, 0px);`
                            }
                        }
                    } else {
                        if (Math.abs(e.offsetX - ev.offsetX) > 10) {
                            if (index.value > 0) {
                                index.value--
                                document.onmousemove = null
                            }
                        } else {
                            if (index.value > 0) {
                                style.value = `transform: translate3d(-${en}px, 0px, 0px);`
                            }
                        }
                    }
                } else {
                    let en = instance?.refs.carousel.clientHeight * index.value + (e.offsetY - ev.offsetY)
                    if (e.offsetY - ev.offsetY > 0) {
                        if (Math.abs(e.offsetY - ev.offsetY) > 10) {
                            if (index.value < uid.value.length - 1)
                                index.value++
                            document.onmousemove = null
                        } else {
                            if (index.value < uid.value.length - 1) {
                                style.value = `transform: translate3d(0px, -${en}px, 0px);`
                            }
                        }
                    } else {
                        if (Math.abs(e.offsetY - ev.offsetY) > 10) {
                            if (index.value > 0) {
                                index.value--
                                document.onmousemove = null
                            }
                        } else {
                            if (index.value > 0) {
                                style.value = `transform: translate3d(0px, -${en}px, 0px);`
                            }
                        }
                    }
                }
                // setTransform(index.value)
            }

            e.preventDefault()

        }

        // 鼠标松开
        function endFn(e: any) {
            document.onmousemove = null
            e.preventDefault()
        }

        function PageUp() {
            setTr()
            if (index.value < uid.value.length - 1) {
                index.value++
            } else {
                isFlipUp.value = 'none'
            }
            // setTransform(index.value)
            return index.value
        }
        function PageDown() {
            setTr()
            if (index.value > 0) {
                index.value--
            } else {
                isFlipDown.value = 'none'
            }
            // setTransform(index.value)
            return index.value
        }
        // <div ref='carouselP' class={['w-carousel-p', props.options.type == 'column' ? 'w-carousel-p_c ' : 'w-carousel-p_r', isP.value]} ></div>

        return () => (
            <div ref='carousel' onMouseout={mouseLeave} onMouseover={mouseover} onMousedown={startFn}
                onMouseup={endFn} class={carousel.value}>
                <div ref='carouselBox' style={style.value} class={carouselBox.value}  {...cls.value}>
                    {ctx.slots.default?.()}
                </div>
                {ctx.slots.flip?.(PageUp, PageDown) ?? (
                    <>
                        <div class={right.value} style={{ display: isFlipUp.value }} onClick={PageUp}> <Icon name="icon-arrow-right-bold"></Icon></div>
                        <div class={left.value} style={{ display: isFlipDown.value }} onClick={PageDown}> <Icon name="icon-arrow-left-bold"></Icon></div>
                    </>)
                }
                {ctx.slots.indicator?.(indicator) ?? indicatorContent.value}
            </div >
        )

    }
})