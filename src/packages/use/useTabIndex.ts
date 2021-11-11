import { onMounted, onUpdated } from 'vue'
import { getStyle, getElement, setAttr } from '../util/'

export default function useTabIndex(el: any) {
  function setTabindex() {
    const _ = getElement(el)
    if (_) {
      const t = getStyle(_, 'tabindex')
      if (t === undefined) {
        setAttr(_, { tabindex: -1 })
      }
    }
  }
  onMounted(setTabindex)
  onUpdated(setTabindex)
}
