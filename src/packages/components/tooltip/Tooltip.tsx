import { ref, computed, defineComponent, cloneVNode, createVNode, h } from 'vue'
import Layer from '../layer'

export default defineComponent({
  name: 'Tooltip',
  props: {
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  setup(props, { slots, emit }) {
    return () => {
      return <Layer v-slots={slots}></Layer>
    }
  }
})
