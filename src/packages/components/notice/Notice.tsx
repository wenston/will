import type { PropType, RendererElement } from 'vue'
import { defineComponent } from 'vue'
import { Transition, Teleport } from 'vue'
import type { NoticePlacementType } from './type'

console.log(Teleport)

export default defineComponent({
  props: {
    show: { type: Boolean as PropType<boolean> },
    content: {
      type: [Array, Object, Number, String]
    },
    placement: {
      type: String as PropType<NoticePlacementType>,
      default: 'top-end'
    },
    to: {
      type: [String, HTMLElement] as PropType<
        RendererElement | string | null | undefined
      >,
      default: () => document.body
    }
  },
  emits: ['update:show'],
  setup(props, { slots, emit, expose }) {
    return () => {
      return (
        <Teleport to={props.to}>
          <Transition>
            {props.show && <div class="w-notice">tongzhi</div>}
          </Transition>
        </Teleport>
      )
    }
  }
})
