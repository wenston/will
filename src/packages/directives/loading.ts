import type {
  ComponentPublicInstance,
  DirectiveBinding,
  ObjectDirective
} from 'vue'
import { createApp } from 'vue'
import { getStyle, setStyle } from '../util'
import useGlobalZIndex from '../use/useGlobalZIndex'
import Loading from '../components/loading/index'

const { zIndex, add } = useGlobalZIndex()

const isStatic = (p: string) => p.toLowerCase() === 'static'

type ComType = {
  setText: (str: string) => void
  setZIndex: (i: string | null) => void
  show: () => void
  hide: () => void
} & ComponentPublicInstance

interface El extends HTMLElement {
  '@loading': ComType | null
}
function createLoading(el: El, { value }: { value: VLoadingDirectiveBinding }) {
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

  el['@loading'] = ins as ComType
  el.appendChild(div)
}

const loadingDirective: ObjectDirective<El, VLoadingDirectiveBinding> = {
  mounted(el, binding: DirectiveBinding<VLoadingDirectiveBinding>) {
    createLoading(el, binding)
    el['@loading']?.setZIndex(zIndex.value + '')
  },
  updated(el, binding: DirectiveBinding<VLoadingDirectiveBinding>) {
    if (el !== null) {
      if (binding.value.loading) {
        if (binding.value.text) {
          el['@loading']!.setText(binding.value.text)
        }
        el['@loading']!.setZIndex(add() + '')
        el['@loading']!.show()
      } else {
        el['@loading']!.hide()
      }
    }
  },
  beforeUnmount(el) {
    el['@loading'] = null
  }
}

export default loadingDirective

export interface VLoadingDirectiveBinding {
  loading: boolean
  text?: string
}
