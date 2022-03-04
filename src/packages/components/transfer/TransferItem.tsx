import { defineComponent, getCurrentInstance, onMounted } from 'vue'

export default defineComponent({
  name: 'TransferItem',
  props: {},
  setup(props, { slots, emit, expose }) {
    expose({
      move() {}
    })
    onMounted(() => {
      const ins = getCurrentInstance()
      console.log(ins)
    })
    return () => {
      return <div class="w-transfer-item">{slots.default?.()}</div>
    }
  }
})
