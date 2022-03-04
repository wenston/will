import { defineComponent, getCurrentInstance, onMounted } from 'vue'

export default defineComponent({
  name: 'TransferItem',
  props: {},
  setup(props, { slots, emit, expose }) {
    return () => {
      return <div class="w-transfer-item">{slots.default?.()}</div>
    }
  }
})
