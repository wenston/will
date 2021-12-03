import type { VNode } from 'vue'
import { defineComponent, computed } from 'vue'
import Layer from '../layer/index'
import Close from '../close/index'
import Btn from '../btn/index'

export default defineComponent({
  inheritAttrs: false,
  name: 'Popup',
  components: { Layer, Close, Btn },
  emits: ['update:show', 'after-ok', 'after-cancel'],
  props: {
    show: { type: Boolean, default: false },
    title: [String, Object, Array],
    width: { type: String, default: '600px' },
    okText: { type: String, default: '确定' },
    cancelText: { type: String, default: '取消' },
    beforeOk: Function,
    beforeCancel: Function,
    hasHeader: { type: Boolean, default: true },
    hasFooter: { type: Boolean, default: true },
    hasMask: { type: Boolean, default: true }
  },
  setup: (props, ctx) => {
    const layerOptions = computed(() => {
      return {
        layerClass: 'w-popup',
        layerStyle: {
          width: props.width
        },
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

    function cancelBtn(hide: () => void) {
      const p = {
        mode: 'line',
        onClick: async () => {
          try {

            await props.beforeCancel?.()
            hide()
            ctx.emit('after-cancel', hide)
          } catch(err) {} finally {

          }
        }
      } as Record<any, any>
      return <Btn {...p}>{props.cancelText}</Btn>
    }

    function okBtn(hide: () => void) {
      const p = {
        type: 'primary',
        onClick: async () => {
          try {

            await props.beforeOk?.()
          } catch(err) {} finally {

            ctx.emit('after-ok', hide)
          }
        }
      } as Record<any, any>
      return <Btn {...p}>{props.okText}</Btn>
    }

    return () => {
      const layerSlots = {
        trigger: ctx.slots.trigger,
        default: (options: {
          toggle: () => void
          hide: () => void
          show: () => void
        }) => {
          const header =
            props.hasHeader &&
            (ctx.slots.header?.(options) ?? (
              <div class="w-popup-header">
                <b class="w-popup-title">{props.title}</b>
                <Close onClick={options.toggle} />
              </div>
            ))
          const body = <div class="w-popup-body">{ctx.slots.default?.(options)}</div>
          const footer =
            props.hasFooter &&
            (ctx.slots.footer?.(options) ?? (
              <div class="w-popup-footer">
                <div>{ctx.slots['footer-prepend']?.(options)}</div>
                <div>
                  {cancelBtn(options.hide)}
                  {okBtn(options.hide)}
                </div>
              </div>
            ))
          return [header, body, footer]
        }
      }

      const lo = layerOptions.value as Record<any, any>
      return <Layer {...lo} v-slots={layerSlots} />
    }
  }
})
