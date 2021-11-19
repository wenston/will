import { defineComponent, ref, computed, renderSlot } from 'vue'
import { onMounted } from 'vue'
import useBoundingClientRect from '../../use/useBoundingClientRect'
import useScroll from '../../use/useScroll'

export default defineComponent({
  props: {
    sourceData: { type: Array, default: () => [] },
    itemHeight: {
      type: Number,
      default: 0
    } //每一项的高度，等高，单位默认是pxdsdfsdsdf
  },
  setup: (props, ctx) => {
    //包裹虚拟列表的根元素
    const root = ref<HTMLElement>()
    //数据渲染起始下标
    const fromIndex = ref(0)
    //根元素的scrollTop
    const { scrollTop } = useScroll(root, handleScroll)
    const sourceLength = computed(() => props.sourceData.length)
    //可视范围的宽高
    const { rect: visibleSize } = useBoundingClientRect(root)
    //可视范围内可显示的数据条数
    const visibleDataLength = computed(() => {
      return Math.ceil(visibleSize.height / (props.itemHeight || 1))
    })
    const toIndex = computed(() => {
      const to = visibleDataLength.value + fromIndex.value + 1
      return Math.min(to, sourceLength.value)
    })

    //顶部占位元素的高度
    const startPlaceholderHeight = computed(() => {
      return fromIndex.value * props.itemHeight
    })
    //底部占位元素的高度
    const endPlaceholderHeight = computed(() => {
      let n = props.sourceData.length - 1 - toIndex.value
      n = n < 0 ? 0 : n
      return n * props.itemHeight
    })
    //可视范围内的数据
    const visibleData = computed(() => {
      if (props.sourceData && props.sourceData.length) {
        return props.sourceData.slice(fromIndex.value, toIndex.value)
      }
    })

    function handleScroll() {
      fromIndex.value = Math.floor(scrollTop.value / props.itemHeight)
      // console.log('渲染数据的起止数据下标', fromIndex.value, toIndex.value)
    }
    onMounted(() => {
      handleScroll()
    })
    return () => {
      const content = renderSlot(ctx.slots, 'default', {
        data: visibleData.value,
        index: {
          from: fromIndex.value,
          to: toIndex.value
        }
      })
      const contentWrapperOptions = {
        class: ['w-virtual-content']
      }
      return (
        <div class="w-virtual" ref={root}>
          <div
            class="w-virtual-placeholder"
            style={{ height: startPlaceholderHeight.value + 'px' }}></div>
          <div {...contentWrapperOptions}>{content}</div>
          <div
            class="w-virtual-placeholder"
            style={{ height: endPlaceholderHeight.value + 'px' }}></div>
        </div>
      )
    }
  }
})
