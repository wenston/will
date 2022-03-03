import { ref, onMounted, computed, reactive } from 'vue'
import useEvent from './useEvent'
import { getElement, getBoundingClientRect, isElement } from '../util'

export default function useBoundingClientRect(el: any) {
  const elem = computed(() => getElement(el))
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
    if (elem.value && isElement(elem.value))
      Object.assign(rect, getBoundingClientRect(elem.value).toJSON())
  }
  onMounted(get)
  useEvent(window, 'resize', get)
  return {
    elem,
    rect
  }
}
