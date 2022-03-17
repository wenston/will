import { ref } from 'vue'
import { getBoundingClientRect } from '../util'
import useEvent from './useEvent'
type PositionType = number | 'left' | 'center' | 'right' | 'bottom' | 'top'
export default function useMousePositionInElement(
  elem: any,
  triggerEvent: keyof GlobalEventHandlersEventMap = 'click'
) {
  const x = ref<PositionType>()
  const y = ref<PositionType>()
  function handleEvent(e: MouseEvent) {
    const elemRect = getBoundingClientRect(elem)
    x.value = e.clientX - elemRect.x
    y.value = e.clientY - elemRect.y
  }
  function reset() {
    x.value = undefined
    y.value = undefined
  }
  useEvent(elem, triggerEvent, handleEvent)
  useEvent(elem, 'mouseleave', reset)
  return { x, y }
}
