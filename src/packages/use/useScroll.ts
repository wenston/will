import type { Ref } from 'vue'
import { onMounted, ref, computed } from 'vue'
import useEvent from './useEvent'
import {
  getElement,
  getPageScroll,
  getWindowSize,
  isElement,
  isWindow
} from '../util'
export default function useScroll(
  elem?: HTMLElement | Ref<HTMLElement | undefined | null>,
  scrollCallback?: Function, //滚动时要做一些事
  immediate?: boolean //是否在挂载完之后立即触发scrollCallback
) {
  const el = computed(() => getElement(elem))
  const scrollTop = ref(0)
  const scrollLeft = ref(0)
  const scrollRight = ref(0)
  const scrollBottom = ref(0)
  function get() {
    const _el = el.value
    if (_el) {
      if (isElement(_el)) {
        scrollTop.value = _el.scrollTop
        scrollLeft.value = _el.scrollLeft
        scrollRight.value = _el.scrollWidth - scrollLeft.value - _el.clientWidth
        scrollBottom.value =
          _el.scrollHeight - scrollTop.value - _el.clientHeight
      } else if (isWindow(_el)) {
        const s = getPageScroll()
        const { inner } = getWindowSize()
        scrollTop.value = s.y
        scrollLeft.value = s.x
        scrollBottom.value =
          document.documentElement.scrollHeight - s.y - inner.height
        scrollRight.value =
          document.documentElement.scrollWidth - s.x - inner.width
      }
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
