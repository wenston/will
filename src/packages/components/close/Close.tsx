import { defineComponent, computed } from 'vue'
import Icon from '../icon/index'
export default defineComponent({
  name: 'Close',
  props: { ...Icon.props, name: { type: String, default: 'w-icon-close' } },
  setup: (props, ctx) => {
    const iconOptions = computed(() => {
      return {
        name: props.name,
        size: props.size,
        class: 'w-close'
      }
    })
    return () => <Icon {...iconOptions.value} />
  }
})
