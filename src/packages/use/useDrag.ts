import { type Ref, watchEffect, ref, computed, onMounted, nextTick } from 'vue'
import { getElement, getOffset, getStyle } from '../util'
import { getBoundingClientRect, setStyle } from '../util'
import useEvent from './useEvent'
import useMouse from './useMouse'

interface PositionType {
  top?: number
  left?: number
}

interface DragOptions {
  x: boolean //x方向是否可拖拽
  y: boolean //y方向是否可拖拽
  area?: any
  limit?:
    | boolean
    | (({ left, top }: { left: number; top: number }) => PositionType)
  //定位干预：在拖拽过程中，干预滑块的定位
  meddle?: (meddleOptions: { left?: number; top?: number }) => PositionType
}

/**
 *
 * @param dragger 要拖拽移动的元素
 * @param 第二个参数 //{ x,y,area } x是x方向，y:y方向，area是拖拽元素活动区域，
 * area如果没有给定，则默认是直接父级
 */
export default function useDrag(
  dragger: any,
  options: DragOptions // = { x: true, y: true, limit: true }
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

  //滑块的尺寸
  const elemSize = computed(() => {
    if (elem.value) {
      const el = elem.value as HTMLElement
      return getBoundingClientRect(el)
    }
  })
  //父级元素的尺寸
  const parentSize = computed(() => {
    if (parentElem.value) {
      return getBoundingClientRect(parentElem.value)
    }
  })

  /**
   * 滑块的活动范围(x方向和y方向的长度)
   */
  const moveSize = computed(() => {
    if (elemSize.value && parentSize.value) {
      return {
        x: parentSize.value.width - elemSize.value.width,
        y: parentSize.value.height - elemSize.value.height
        // x: parentSize.value.width,
        // y: parentSize.value.height
      }
    }
  })

  const topPercent = computed(() => {
    if (top.value !== undefined && moveSize.value !== undefined) {
      return top.value / moveSize.value.y
    }
    return 0
  })
  const leftPercent = computed(() => {
    if (left.value !== undefined && moveSize.value !== undefined) {
      return left.value / moveSize.value.x
    }
    return 0
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
      let t = client.y - dy.value,
        l = client.x - dx.value

      eventType.value = 'mousemove'
      if (options.limit) {
        if (typeof options.limit === 'boolean') {
          if (options.limit) {
            if (t < 0) {
              t = 0
            } else {
              if (parentSize.value && elemSize.value) {
                const _t = parentSize.value.height - elemSize.value.height
                if (t > _t) {
                  t = _t
                }
              }
            }
            if (l < 0) {
              l = 0
            } else {
              if (parentSize.value && elemSize.value) {
                const _l = parentSize.value.width - elemSize.value.width
                if (l > _l) {
                  l = _l
                }
              }
            }
          }
        } else if (typeof options.limit === 'function') {
          const { top: _t, left: _l } = options.limit({ top: t, left: l })
          if (_t !== undefined) {
            t = _t
          }
          if (_l !== undefined) {
            l = _l
          }
        }
      }
      if (options.meddle) {
        const { top: m_t, left: m_l } = options.meddle({
          top: t,
          left: l
        })
        if (m_t !== undefined) {
          t = m_t
        }
        if (m_l !== undefined) {
          l = m_l
        }
      }
      if (options.y) {
        top.value = t
      }
      if (options.x) {
        left.value = l
      }
    }
  }
  function inMouseup(e: MouseEvent) {
    inDragging.value = false
    eventType.value = 'mouseup'
  }
  useEvent(dragger, 'mousedown', startMousedown)

  function setPosition() {}

  return {
    top,
    left,
    topPercent,
    leftPercent,
    eventType,
    dragging: inDragging,
    setPosition
  }
}
