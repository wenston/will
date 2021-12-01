import { defineComponent, computed } from 'vue'
import Layer from '../layer/index'
import Close from '../close/index'

export default defineComponent({
  name: 'Popup',
  components: { Layer, Close },
  emits: ['update:show'],
  props: {
    show: { type: Boolean, default: false },
    hasMask: { type: Boolean, default: true }
  },
  setup: (props, ctx) => {
    const layerOptions = computed(() => {
      return {
        show: props.show,
        placement: 'client-center',
        trigger: 'click',
        canCloseByClickOutside: false,
        hasMask: props.hasMask,
        'onUpdate:show': (v: boolean) => {
          ctx.emit('update:show', v)
        }
      }
    })

    return () => {
      const layerSlots = {
        trigger: ctx.slots.trigger,
        default: (options: Record<any, any>) => {
          const header = ctx.slots.header?.(options)
          const body = ctx.slots.default?.(options)
          const footer = ctx.slots.footer?.(options)
          return [header, body, footer]
        }
      }

      const lo = layerOptions.value as Record<any, any>
      return <Layer {...lo} v-slots={layerSlots} />
    }
  }
})
