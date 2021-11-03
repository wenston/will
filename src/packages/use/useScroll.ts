import { onMounted, ref, Ref } from 'vue'
import useEvent from './useEvent'
export default function useScroll(elem?: Ref) {
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

  useEvent(ref(window), 'scroll', get)
  useEvent(ref(elem), 'scroll', get)
  onMounted(get)
  return { scrollTop, scrollLeft, scrollRight, scrollBottom, getScroll: get }
}
