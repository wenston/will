import { isRef, onUpdated, onMounted, ref, Ref } from 'vue'
import { getElement, getInvisibleElementSize as getSize } from '../util'
/**
 * 获取真实的元素。并获取元素的宽高（元素display:none时，通过其他方式获取！）
 * @param
 * @returns
 */
export default function useElement(v?: any) {
  const el = ref()
  const width = ref(0)
  const height = ref(0)
  function get(val?: any) {
    const _el = getElement(val || v)
    el.value = _el
    return _el
  }
  function getInvisibleElementSize(
    el?: any,
    nearby?: boolean,
    relate?: any,
    transitionName?: string
  ) {
    const s = getSize(get(el || v), nearby, relate, transitionName)
    width.value = s.width
    height.value = s.height
    return s
  }
  onMounted(() => {
    v && get()
  })
  onUpdated(() => {
    v && get()
  })
  return { el, get, width, height, getInvisibleElementSize }
}
