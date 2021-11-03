import type { PropType } from 'vue'
import { ref, defineComponent } from 'vue'
import useToggleArray from '../../use/toggle/useToggleArray'
import useToggleMap from '../../use/toggle/useToggleMap'
export default defineComponent({
  props: {
    data: {
      type: [Array, Set, Map] as PropType<any[] | Set<any> | Map<any, any>>,
      default: () => [false, true],
      required: true
    },
    item: {
      type: [Boolean, String, Number, Object],
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    function toggle() {}
    return () => {
      return context.slots.default?.({
        ...props,
        toggle
      })
    }
  }
})
