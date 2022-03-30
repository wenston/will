import { onMounted, ref, computed } from 'vue'
import { getElement, getOffset, getStyle, setStyle } from '../util'
import useEvent from './useEvent'
import useMouse from './useMouse'

interface DragOptions {
  x: boolean
  y: boolean
  area?: any
}

/**
 *
 * @param dragger 要拖拽移动的元素
 * @param 第二个参数 //{ x,y,area } x是x方向，y:y方向，area是拖拽元素活动区域，
 * area如果没有给定，则默认是直接父级
 */
export default function useDrag(
  dragger: any,
  options: DragOptions = { x: true, y: true }
) {
  const left = ref<number>()
  const top = ref<number>()
  const eventType = ref<'mousedown' | 'mouseup' | 'mousemove'>()
  const { client } = useMouse({ mousemove: inMousemove, mouseup: inMouseup })
  //位移距离
  const dx = ref(0)
  const dy = ref(0)
  const inDragging = ref(false)
  const elem = computed(() => getElement(dragger))
  const parentElem = computed(() => {
    if (options.area !== undefined) {
      return getElement(options.area) as HTMLElement
    } else if (elem.value && elem.value instanceof HTMLElement) {
      return elem.value.parentElement as HTMLElement
    } else {
      return document.body
    }
  })

  function initPositionStyle() {
    if (parentElem.value && parentElem.value instanceof HTMLElement) {
      const pos = getStyle(parentElem.value, 'position')
      if (pos === 'static') {
        setStyle(parentElem.value)('position', 'relative')
      }
    }
    if (elem.value && elem.value instanceof HTMLElement) {
      const pos = getStyle(elem.value, 'position')
      if (pos === 'static' || pos === 'relative') {
        setStyle(elem.value)('position', 'absolute')
      }
    }
  }

  function startMousedown(e: MouseEvent) {
    initPositionStyle()
    if (elem.value && elem.value instanceof HTMLElement) {
      const { left, top } = getOffset(<HTMLElement>elem.value, parentElem.value)
      dx.value = client.x - left
      dy.value = client.y - top
    }

    inDragging.value = true
    eventType.value = 'mousedown'
  }

  function inMousemove(e: MouseEvent) {
    if (inDragging.value) {
      if (options.y) {
        top.value = client.y - dy.value
      }
      if (options.x) {
        left.value = client.x - dx.value
      }
      eventType.value = 'mousemove'
    }
  }
  function inMouseup(e: MouseEvent) {
    inDragging.value = false
    eventType.value = 'mouseup'
  }
  useEvent(dragger, 'mousedown', startMousedown)
  return { top, left, eventType }
}
