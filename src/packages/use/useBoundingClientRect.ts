import { ref, onMounted, reactive } from 'vue'
import useEvent from './useEvent'
import { getElement, getBoundingClientRect } from '../util'

export default function useBoundingClientRect(el: any) {
  const elem = ref<HTMLElement>()
  const rect = reactive({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  })
  function get() {
    Object.assign(rect, getBoundingClientRect(elem.value).toJSON())
  }
  onMounted(() => {
    elem.value = getElement(el)
    get()
  })
  useEvent(window, 'resize', get)
  return {
    elem,
    rect
  }
}
