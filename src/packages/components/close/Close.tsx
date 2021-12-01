import { defineComponent, computed } from 'vue'
import Icon from '../icon/index'
export default defineComponent({
  props: { ...Icon.props },
  setup: (props, ctx) => {
    const iconName = computed(() => props.name || 'w-icon-close')
    const iconOptions = computed(() => {
      return {
        name: iconName.value,
        size: props.size,
        class: 'w-close'
      }
    })
    return <Icon {...iconOptions.value} />
  }
})
