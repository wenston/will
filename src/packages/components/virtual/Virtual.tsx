import type { PropType, SetupContext } from 'vue'
import { defineComponent, ref, computed, renderSlot } from 'vue'
import useBoundingClientRect from '../../use/useBoundingClientRect'
import useScroll from '../../use/useScroll'
import { EmptyObject } from '../../config/types'
export type TreeDataType = any[]
export interface TreeDefaultSlotOptions extends EmptyObject {
  data: TreeDataType
  index: {
    from: number
    to: number
  }
}
export default defineComponent({
  props: {
    sourceData: { type: Array as PropType<TreeDataType>, default: () => [] },
    itemHeight: {
      type: Number,
      default: 0
    } //每一项的高度，等高，单位默认是pxdsdfsdsdf
  },
  setup: (props, ctx) => {
    //包裹虚拟列表的根元素
    const root = ref<HTMLElement>()
    //根元素的scrollTop
    const { scrollTop } = useScroll(root, handleScroll, true)
    //可视范围的宽高
    const { rect: visibleSize } = useBoundingClientRect(root)
    const sourceLength = computed(() => props.sourceData.length)
    //数据渲染起始下标
    const fromIndex = ref(0)
    //可视范围内可显示的数据条数
    const visibleDataLength = computed(() => {
      return Math.ceil(visibleSize.height / (props.itemHeight || 1))
    })
    const toIndex = computed(() => {
      const to = visibleDataLength.value + fromIndex.value + 1
      return Math.min(to, sourceLength.value)
    })
    //可视范围内的数据
    const visibleData = computed(() =>
      props.sourceData.slice(fromIndex.value, toIndex.value)
    )

    //顶部占位元素的高度
    const startPlaceholderHeight = computed(() => {
      return fromIndex.value * props.itemHeight
    })
    //底部占位元素的高度
    const endPlaceholderHeight = computed(() => {
      let n = sourceLength.value - 1 - toIndex.value
      n = n < 0 ? 0 : n
      return n * props.itemHeight
    })

    function handleScroll(e: any) {
      fromIndex.value = Math.floor(scrollTop.value / props.itemHeight)
    }
    return () => {
      const d: TreeDefaultSlotOptions = {
        data: visibleData.value,
        index: {
          from: fromIndex.value,
          to: toIndex.value
        },
        scrollTo: (x: number, y: number) => {
          root.value?.scrollTo(x, y)
        }
      }
      const content = renderSlot(ctx.slots, 'default', d)
      const contentWrapperOptions = {
        class: ['w-virtual-content'],
        style: {
          paddingTop: startPlaceholderHeight.value + 'px',
          paddingBottom: endPlaceholderHeight.value + 'px'
        }
      }
      return (
        <div class="w-virtual" ref={root}>
          <div {...contentWrapperOptions}>{content}</div>
        </div>
      )
    }
  }
})
