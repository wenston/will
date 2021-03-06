import { computed, defineComponent, h } from 'vue'
import type { VNode, PropType } from 'vue'
import type { BtnType, BtnMode } from '../../config/types'

export default defineComponent({
  name: 'Btn',
  props: {
    tag: {
      type: String as PropType<keyof HTMLElementTagNameMap>,
      default: 'button'
    },
    type: { type: String as PropType<BtnType>, default: 'default' },
    mode: String as PropType<BtnMode>,
    block: Boolean,
    disabled: Boolean,
    capsule: Boolean,
    text: [String, Number, Object, Array]
  },
  setup(props, { slots, attrs }) {
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
        slots.default?.() || props.text
      )
      return mainBtn
      // return (
      //   <button
      //     class={klass.value}
      //     onClick={(e: MouseEvent) => {
      //       if (props.disabled) {
      //         e.stopImmediatePropagation()
      //       }
      //     }}>
      //     {slots.default?.()}
      //   </button>
      // )
    }
  }
})
