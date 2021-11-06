import { onMounted, ref } from 'vue'
import useEvent from './useEvent'
import useElement from './useElement'
export default function useScroll(elem?: any) {
  const { el } = useElement(elem)
  const scrollTop = ref(-1)
  const scrollLeft = ref(-1)
  const scrollRight = ref(-1)
  const scrollBottom = ref(-1)
  function get() {
    const el = elem?.value ?? null
    if (el) {
      scrollTop.value = el.scrollTop
      scrollLeft.value = el.scrollLeft
      scrollRight.value = el.scrollWidth - scrollLeft.value - el.clientWidth
      scrollBottom.value = el.scrollHeight - scrollTop.value - el.clientHeight
    }
  }

  useEvent(window, 'scroll', get)
  useEvent(el, 'scroll', get)
  onMounted(get)
  return { scrollTop, scrollLeft, scrollRight, scrollBottom, getScroll: get }
}
