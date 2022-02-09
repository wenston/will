import { h, PropType } from 'vue'
import { defineComponent, computed, ref, onMounted, watch, reactive, renderSlot } from 'vue'
import sortable from 'sortablejs'
type FilterType = string | string[] | Function
interface OptionsType {
    // filter: FilterType
    [k: string]: any,

}
export default defineComponent({
    name: 'Dragover',
    props: {
        sort: { //是否组件内拖拽
            type: Boolean,
            default: true
        },
        animation: { // 动画时间
            type: Number,
            default: 200
        },
        delay: { // 定义鼠标选中列表单元可以开始拖动的延迟时间
            type: Number,
            default: 0
        },
        pull: { //是否允许拖入当前组
            type: Boolean,
            default: true
        },
        put: { //是否允许拖出当前组
            type: Boolean,
            default: true
        },
        filter: { //过滤 是否可拖拽的子元素
            type: [String, Array, Function] as PropType<FilterType>,
            default: ''
        },
        dragClass: { // 拖拽对象的样式名称，如chosenClass:"chosen"
            type: String,
            default: 'dragClass'
        },
        chosenClass: { // 指定选中对象的样式名称，如chosenClass:"chosen"
            type: String,
            default: 'chosenClass'
        },
        ghostClass: {// 格式为简单css选择器的字符串，当拖动列表单元时会生成一个副本作为影子单元来模拟被拖动单元排序的情况，此配置项就是来给这个影子单元添加一个class，我们可以通过这种方式来给影子元素进行编辑样式；
            type: String,
            default: 'ghostClass'
        },
        clone: {
            type: Boolean,
            default: false
        },
        dragoverClass: {
            type: String,
            default: 'dragover'
        },

        type: {
            type: String,
            default: 'row'
        },
        canter: {
            type: String,
            default: null
        },
        flex: {
            type: Boolean,
            default: true
        },
    },
    emits: ['onChoose', 'onStart', 'onUnChoose', 'onEnd', 'onAdd', 'onUpdate', 'onSort', 'onRemove', 'onMove', 'onClone',
        'onChange'],
    setup(props, ctx) {
        const options = reactive<OptionsType>({
            animation: props.animation,
            delay: props.delay,
            draggable: '.DragoverItem',
            chosenClass: props.chosenClass,
            dragClass: props.dragClass,
            // ghostClass: props.ghostClass,
            sort: props.sort,
            fallbackClass: true,
            forceFallback: false,
            group: {
                name: 'Dragover',
                pull: props.clone ? 'clone' : props.pull,
                put: props.put
            },
            onEnd: (e: any) => { // 拖拽结束后执行的回调事件
                // console.log(data.value.toArray(), e);
                // e.clone = null
                ctx.emit('onEnd', e, data.value.toArray())
            },
            onChoose: (e: any) => { // 指定选中对象执行的方法
                ctx.emit('onChoose', e)
            },
            onStart: (e: any) => { // 开始拖拽执行的回调事件
                ctx.emit('onStart', e)
            },
            onUnchoose: (e: any) => {  // 指定放弃选中对象执行的回调方法
                ctx.emit('onUnChoose', e)
            },
            onAdd: (e: any) => { // 多组拖拽时新增元素事件
                // console.log(e);
                // e.clone = null
                ctx.emit('onAdd', e)
            },
            onUpdate: (e: any) => { //拖拽元素更改变化的事件，元素的增加减少并不会触发
                ctx.emit('onUpdate', e)
            },
            onSort: (e: any) => { // 拖拽位置发生改变的事件
                ctx.emit('onSort', e)
            },
            onRemove: (e: any) => { //把元素从组移除事件
                ctx.emit('onRemove', e)
            },
            onMove: (e: any) => { // 拖拽过程中（替换其他元素位置）执行返回true可以替换位置，返回false取消替换位置
                ctx.emit('onMove', e)
            },
            onClone: (e: any) => { // 克隆时会触发该事件
                // e.clone = null
                ctx.emit('onClone', e)
            },
            onChange: (e: any) => {
                ctx.emit('onChange', e)
            },
            filter: ''

        })
        const data: any = ref(null)
        if (props.filter) {
            options.filter = props.filter
        }
        onMounted(() => {
            let dr: any = document.getElementById(props.dragoverClass)
            data.value = sortable.create(dr, options)
        })
        const classS = computed(() => {
            let s = []
            if (props.type != 'row') {
                s.push('k-direction-column')
            }
            if (props.canter) {
                s.push('k-align-items-center')
            }
            // if (props.flex) {
            //     s.push('k-flex')
            // }


            return s
        })
        return () => h(
            'div', {
            id: props.dragoverClass,
            class: ['k-flex', classS.value],
        },
            [ctx.slots.default?.()]
        )
    }
})