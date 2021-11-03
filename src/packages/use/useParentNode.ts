import { onMounted, ref, onUpdated } from 'vue'
import { getStyle } from '../util'
import useElement from './useElement'

export default function useParentNode(elem: any) {
  const parentNode = ref<HTMLElement>()
  const { el } = useElement(elem)
  function getPNode() {
    let _node: any = null
    const _el = el.value
    if (_el === undefined) {
      console.warn('获取的节点为undefined')
    } else {
      _node = _el.parentNode
      const position = getStyle(_node, 'position')
      if (position === 'static') {
        _node.style.position = 'relative'
      }
      parentNode.value = _node
    }
  }
  onMounted(getPNode)
  onUpdated(getPNode)
  return {
    parentNode
  }
}
