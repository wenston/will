import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import type { BtnType, BtnMode } from '../../config/types'

export default defineComponent({
  props: {
    tag: { type: String, default: 'button' },
    type: { type: String as PropType<BtnType>, default: 'default' },
    mode: String as PropType<BtnMode>,
    block: Boolean,
    disabled: Boolean,
    capsule: Boolean
  },
  setup(props, { slots }) {
    const klass = computed(() => {
      return [
        'w-btn',
        'w-btn-gap',

        {
          'w-btn-capsule': props.capsule,
          'w-btn-block': props.block,
          'w-btn-disabled': props.disabled,
          [`w-btn-${props.type}`]: props.type,
          [`w-btn-mode-${props.mode}`]: props.mode
        }
      ]
    })
    return () => {
      const mainBtn = h(
        props.tag,
        {
          class: klass.value,
          onClick: (e: MouseEvent) => {
            if (props.disabled) {
              e.stopImmediatePropagation()
            } else {
            }
          }
        },
        [slots.default?.()]
      )
      return mainBtn
    }
  }
})
