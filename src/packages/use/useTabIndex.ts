import { computed, onMounted, onUpdated } from 'vue'
import { getStyle, getElement, setAttr, isElement } from '../util/'

export default function useTabIndex(el: any) {
  const _ = computed(() => getElement(el))
  function setTabindex() {
    const _el = _.value
    if (_el && isElement(_el)) {
      const t = getStyle(_el, 'tabindex')
      if (t === undefined) {
        setAttr(_el, { tabindex: -1 })
      }
    }
  }
  onMounted(setTabindex)
  onUpdated(setTabindex)
}
