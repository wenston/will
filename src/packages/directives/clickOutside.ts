import { Ref, DirectiveBinding, ObjectDirective } from 'vue'
import { getElement } from '../util'
import { isFunction, isObject } from '../util/'
const NOOP = () => {}
// import useEvent from '../use/useEvent'

type ClickOutsideHandler = (event: Event) => void
interface ClickOutsideOptions {
  exclude: Ref<HTMLElement>[]
  handler: ClickOutsideHandler
}
interface DocumentHandlerOptions {
  exclude: HTMLElement[]
  handler: ClickOutsideHandler
}
export type ClickOutsideBinding = ClickOutsideOptions | ClickOutsideHandler
const docHandlers = new Map<HTMLElement, DocumentHandlerOptions>()
function createHandler(el: HTMLElement, bindingValue: ClickOutsideBinding) {
  const exclude = [el]
  let handler: ClickOutsideHandler = NOOP
  if (isFunction(bindingValue)) {
    handler = bindingValue
  } else if (isObject(bindingValue)) {
    exclude.push(...bindingValue.exclude.map((el) => getElement(el)))
    handler = bindingValue.handler
  }
  docHandlers.set(el, { exclude, handler })
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
  docHandlers.forEach(({ exclude, handler }, el) => {
    // console.log(exclude)
    const isSelf = tar === el
    const isContain = el.contains(tar)
    const isExclude =
      exclude.length &&
      exclude.some((_el) => _el && (_el === tar || _el.contains(tar)))
    if (isSelf || isContain || isExclude) {
      return
    }
    handler(e)
  })
}

document.addEventListener('click', docListener)

export default clickout()
