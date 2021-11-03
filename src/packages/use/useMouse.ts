import { reactive, ref, computed } from 'vue'
import useEvent from './useEvent'

export default function useMouse() {
  const client = reactive({ x: 0, y: 0 })
  const page = reactive({ x: 0, y: 0 })
  const doc = ref(document)
  function handler(e: MouseEvent) {
    ;({ clientX: client.x, clientY: client.y, pageX: page.x, pageY: page.y } = e)
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
