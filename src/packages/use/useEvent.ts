import type { Ref, ComputedRef } from 'vue'
import { onMounted, onBeforeUnmount, onUpdated, getCurrentInstance } from 'vue'
import { getElement } from '../util'
import useElement from './useElement'
type ElemType = Window | Document | HTMLElement | Ref | ComputedRef
type ListenerType = EventListener | Function
export default function useEvent(
  elem?: ElemType, //elem.value可能是HTMLElement，也可能个组件！
  type?: string,
  listener?: ListenerType
) {
  const ins = getCurrentInstance()
  const { el } = useElement(elem)
  function add(node?: ElemType, eventType?: string, handler?: ListenerType) {
    const _el = node ? getElement(node) : el.value
    const _type = eventType || type
    const fn = handler || listener
    if (_el) {
      _el.addEventListener(_type, fn)
      el.value = _el
    }
    return fn
  }
  function remove(node?: ElemType, eventType?: string, handler?: ListenerType) {
    const _el = node ? getElement(node) : el.value
    const _type = eventType || type
    const fn = handler || listener
    if (_el) {
      _el.removeEventListener(_type, fn)
    }
    // console.log("remove")
  }
  if (ins) {
    onMounted(() => {
      elem && add()
    })
    onUpdated(() => {
      // TODO: 这里不能一股脑的remove在add，应当判断elem是否发生了变化
      // remove()
      add()
    })

    onBeforeUnmount(remove)
  }

  return {
    add,
    remove
  }
}
