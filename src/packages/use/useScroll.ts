import { onMounted, ref } from 'vue'
import useEvent from './useEvent'
import useElement from './useElement'
export default function useScroll(
  elem?: any,
  scrollCallback?: Function, //滚动时要做一些事
  immediate?: boolean //是否在挂载完之后立即触发scrollCallback
) {
  const { el } = useElement(elem)
  const scrollTop = ref(0)
  const scrollLeft = ref(0)
  const scrollRight = ref(0)
  const scrollBottom = ref(0)
  function get() {
    const el = elem?.value ?? null
    if (el) {
      scrollTop.value = el.scrollTop
      scrollLeft.value = el.scrollLeft
      scrollRight.value = el.scrollWidth - scrollLeft.value - el.clientWidth
      scrollBottom.value = el.scrollHeight - scrollTop.value - el.clientHeight
    }
  }
  function doCallback() {
    scrollCallback?.({
      scrollTop: scrollTop.value,
      scrollBottom: scrollBottom.value,
      scrollLeft: scrollLeft.value,
      scrollRight: scrollRight.value
    })
  }
  useEvent(el, 'scroll', () => {
    get()
    doCallback()
  })
  onMounted(() => {
    get()
    if (immediate) {
      doCallback()
    }
  })
  return { scrollTop, scrollLeft, scrollRight, scrollBottom, getScroll: get }
}
