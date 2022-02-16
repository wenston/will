import type { DirectiveBinding, ObjectDirective } from 'vue'
import { createApp } from 'vue'
import { getStyle, setStyle } from '../util'
import useGlobalZIndex from '../use/useGlobalZIndex'
import Loading from '../components/loading/index'

const { zIndex, add } = useGlobalZIndex()

const instanceName: string = '@loading'
const isStatic = (p: string) => p.toLowerCase() === 'static'

function createLoading(
  el: HTMLElement,
  { value }: { value: VLoadingDirectiveBinding }
) {
  let div: HTMLDivElement = document.createElement('div')
  const app = createApp(Loading, {
    class: 'w-loading-mask',
    show: value.loading,
    text: value.text,
    transitionName: 'w-fade-white'
  })
  const ins = app.mount(div)
  const position = getStyle(el, 'position')
  if (isStatic(position)) {
    setStyle(el)('position', 'relative')
  }

  ;(el as Record<any, any>)[instanceName] = ins
  el.appendChild(div)
}

const loadingDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    createLoading(el, binding)
    ;(el as Record<any, any>)[instanceName].setZIndex(zIndex)
  },
  updated(el, binding: DirectiveBinding) {
    if (binding.value.loading) {
      if (binding.value.text) {
        el[instanceName].setText(binding.value.text)
      }
      el[instanceName].setZIndex(add())
      el[instanceName].show()
    } else {
      el[instanceName].hide()
    }
  },
  beforeUnmount(el: HTMLElement) {
    ;(el as Record<any, any>)[instanceName] = null
  }
}

export default loadingDirective

export interface VLoadingDirectiveBinding {
  loading: boolean
  text?: string
}
