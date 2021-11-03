import type { PropType } from 'vue'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    name: { type: String as PropType<string>, required: true },
    color: String,
    size: String
  },
  setup(props, { slots }) {
    return () => {
      return <i class={['iconfont', 'w-icon', props.name]}>{slots.default?.()}</i>
    }
  }
})
