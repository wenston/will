import type { Ref, DirectiveBinding, ObjectDirective } from 'vue'
import { getElement, isElement } from '../util'
import { isFunction, isObject } from '../util'
const NOOP = () => {}

// import useEvent from '../use/useEvent'
// declare interface HTMLElement {
//   IS_OUT_MOUSEDOWN: boolean
//   IS_OUT_MOUSEUP:boolean
// }

type ClickOutsideHandler = (event: Event) => void
interface ClickOutsideOptions {
  exclude: Ref<HTMLElement>[]
  handler: ClickOutsideHandler
}
interface DocumentHandlerOptions {
  exclude: HTMLElement[]
  handler: ClickOutsideHandler
  isOut: {
    mousedown: boolean
    mouseup: boolean
  }
}
export type ClickOutsideBinding = ClickOutsideOptions | ClickOutsideHandler
const docHandlers = new Map<HTMLElement, DocumentHandlerOptions>()
function createHandler(el: HTMLElement, bindingValue: ClickOutsideBinding) {
  // el.IS_OUT_MOUSEDOWN = false
  // el.IS_OUT_MOUSEUP = false
  const exclude = [el]
  let handler: ClickOutsideHandler = NOOP
  if (isFunction(bindingValue)) {
    handler = bindingValue
  } else if (isObject(bindingValue)) {
    const _els: HTMLElement[] = []
    let i = 0
    const len = bindingValue.exclude.length
    while (i < len) {
      const _el = getElement(bindingValue.exclude[i])
      if (_el && isElement(_el)) {
        _els.push(_el)
      }
      i++
    }
    exclude.push(..._els)
    handler = bindingValue.handler
  }
  docHandlers.set(el, {
    exclude,
    handler,
    isOut: {
      mousedown: false,
      mouseup: false
    }
  })
}
const clickout = () => {
  const clickOutside: ObjectDirective = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      createHandler(el, binding.value)
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
      // console.log(binding.value)
      createHandler(el, binding.value)
    },
    unmounted(el) {
      docHandlers.delete(el)
      // if(docHandlers.size===0) {
      //     document.removeEventListener('click', docListener)
      // }
    }
  }
  return clickOutside
}

const docListener: EventListener = (e) => {
  const tar = e.target as Node
  docHandlers.forEach(({ exclude, handler, isOut }, el) => {
    // console.log(exclude)

    const isSelf = tar === el
    const isContain = el.contains(tar)
    const isExclude =
      exclude.length &&
      exclude.some((_el) => _el && (_el === tar || _el.contains(tar)))
    if (isSelf || isContain || isExclude) {
      if (e.type === 'mousedown' || e.type === 'mouseup') {
        isOut[e.type] = false
      }

      return
    } else {
      if (e.type === 'mousedown' || e.type === 'mouseup') {
        isOut[e.type] = true
      }
    }

    if (isOut.mousedown && isOut.mouseup) {
      handler(e)
    }
  })
}

document.addEventListener('mousedown', docListener)
document.addEventListener('mouseup', docListener)

export default clickout()
