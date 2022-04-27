import { reactive, toRefs, computed } from 'vue'
import useEvent from './useEvent'
export default function useMouse(callbackHandler?: {
  mousemove?: Function
  mousedown?: Function
  mouseup?: Function
  mouseover?: Function
}) {
  const doc = document
  const client = reactive({ x: 0, y: 0 })
  const page = reactive({ x: 0, y: 0 })
  function handler(e: MouseEvent) {
    ;({
      clientX: client.x,
      clientY: client.y,
      pageX: page.x,
      pageY: page.y
    } = e)

    if (callbackHandler) {
      const {
        mousemove: mm,
        mousedown: md,
        mouseup: mu,
        mouseover: mo
      } = callbackHandler
      if (e.type === 'mousemove') {
        mm?.(e)
      }
      if (e.type === 'mousedown') {
        md?.(e)
      }
      if (e.type === 'mouseover') {
        mo?.(e)
      }
      if (e.type === 'mouseup') {
        mu?.(e)
      }
    }
  }
  useEvent(doc, 'mousemove', handler)
  useEvent(doc, 'mousedown', handler)
  useEvent(doc, 'mouseup', handler)
  useEvent(doc, 'mouseover', handler)
  return {
    client,
    page
  }
}
