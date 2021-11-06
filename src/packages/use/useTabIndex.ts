import { onMounted } from 'vue'
import { getStyle, getElement, setAttr } from '../util/'

export default function useTabIndex(el: any) {
  onMounted(() => {
    const _ = getElement(el)
    if (_) {
      const t = getStyle(_, 'tabindex')
      if (t === undefined) {
        setAttr(_, { tabindex: -1 })
      }
    }
  })
}
