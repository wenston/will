import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: { type: String as PropType<string> },
    color: String,
    size: String
  },
  setup(props, { slots }) {
    return () => {
      return (
        <i
          class={['iconfont', 'w-icon', props.name]}
          style={{ 'font-size': props.size, color: props.color }}>
          {slots.default?.()}
        </i>
      )
    }
  }
})
