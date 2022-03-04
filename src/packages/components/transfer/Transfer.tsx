import {
  defineComponent,
  ref,
  mergeProps,
  computed,
  onMounted,
  getCurrentInstance
} from 'vue'
import TransferItem from './TransferItem'
const TRANSFER = defineComponent({
  inheritAttrs: false,
  name: 'Transfer',
  props: {
    direction: { type: String, default: 'x' }
  },
  setup(props, { slots, emit, expose, attrs }) {
    const options = computed(() => {
      return mergeProps(
        {
          class: ['w-transfer']
        },
        attrs
      )
    })
    const wrapperOptions = computed(() => {
      return mergeProps(
        {
          class: ['w-transfer-item-wrapper', `w-transfer-${props.direction}`]
        }
        // attrs
      )
    })
    function prev() {
      console.log('上一个')
    }
    function next() {
      console.log('下↓一个')
    }
    onMounted(() => {
      const ins = getCurrentInstance()
      console.log('Transfer组件挂载', slots.default?.())
      const defaults = slots.default?.()
      if (defaults) {
        defaults.forEach((d) => {
          console.log(d)
        })
      }
    })
    return () => {
      return (
        <>
          {slots.use?.({ prev, next })}
          <div {...options.value}>
            <div {...wrapperOptions.value}>{slots.default?.()}</div>
          </div>
        </>
      )
    }
  }
})
TRANSFER.item = TransferItem
export default TRANSFER
