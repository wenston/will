import { PropType, watch } from 'vue'
import { ref, defineComponent, computed } from 'vue'
import Layer from '../layer/index'
import Close from '../close/index'
import Btn from '../btn/index'
import Loading from '../loading/index'
import useGlobalZIndex from '../../use/useGlobalZIndex'
import type { LoadingComponentProps } from '../loading/type'
import type { PlacementType, TriggerType } from '../../config/types'
// import useGlobalZIndex from '../../use/useGlobalZIndex'
export interface PopupStateMethods {
  toggle?: () => void
  hide?: () => void
  show?: () => void
  setLoading?: (b: boolean) => void
}
export default defineComponent({
  inheritAttrs: false,
  name: 'Popup',
  components: { Layer, Close, Btn },
  emits: ['update:show', 'after-ok', 'after-cancel', 'after-enter'],
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
    hasMask: { type: Boolean, default: true },
    loading: {
      type: Object as PropType<LoadingComponentProps>,
      default: () => ({ show: false })
    }
  },
  setup: (props, ctx) => {
    const { zIndex, add } = useGlobalZIndex()
    const isAfterEnter = ref(false)
    const showLoading = ref(props.loading.show ?? false)
    const layerOptions = computed(() => {
      return {
        layerClass: 'w-popup',
        layerStyle: {
          width: props.width
        },
        show: props.show,
        placement: 'client-center' as PlacementType,
        trigger: 'click' as TriggerType,
        canCloseByClickOutside: false,
        hasMask: props.hasMask,
        'onUpdate:show': (v: boolean) => {
          if (!v) {
            isAfterEnter.value = false
          } else {
            add()
          }
          ctx.emit('update:show', v)
        },
        'onAfter-enter': (el: Element) => {
          // isAfterEnter.value = true
          ctx.emit('after-enter', el)
        }
      }
    })

    function setLoading(b: boolean) {
      showLoading.value = b
    }
    async function handleCancel(options: PopupStateMethods) {
      setLoading(false)
      try {
        await props.beforeCancel?.()
        options.hide?.()
        ctx.emit('after-cancel', options)
      } catch (err) {
      } finally {
      }
    }
    function cancelBtn(options: PopupStateMethods) {
      const p = {
        mode: 'line',
        onClick: () => {
          handleCancel(options)
        }
      } as Record<any, any>
      return <Btn {...p}>{props.cancelText}</Btn>
    }

    function okBtn(options: PopupStateMethods) {
      const p = {
        type: 'primary',
        disabled: showLoading.value,
        onClick: async () => {
          try {
            await props.beforeOk?.()
          } catch (err) {
          } finally {
            ctx.emit('after-ok', options)
          }
        }
      } as Record<any, any>
      return <Btn {...p}>{props.okText}</Btn>
    }

    //loading状态
    function renderLoading() {
      const loadingOptions = {
        ...props.loading,
        show: showLoading.value,
        transitionName: 'w-fade-white',
        class: 'w-popup-loading',
        style: {
          'z-index': zIndex.value
        }
      }
      return <Loading {...loadingOptions} />
    }

    watch(
      () => props.loading.show,
      (v) => {
        showLoading.value = v ?? false
      }
    )

    return () => {
      const layerSlots = {
        trigger: ctx.slots.trigger,
        default: (e: PopupStateMethods) => {
          const options = { ...e, setLoading }
          const header =
            props.hasHeader &&
            (ctx.slots.header?.(options) ?? (
              <div class="w-popup-header">
                <b class="w-popup-title">{props.title}</b>
                <Close
                  onClick={() => {
                    handleCancel(options)
                  }}
                />
              </div>
            ))
          const body = (
            <div
              class={[
                'w-popup-body',
                isAfterEnter.value ? 'w-overflow-auto' : ''
              ]}>
              {ctx.slots.default?.(options)}
            </div>
          )
          const footer =
            props.hasFooter &&
            (ctx.slots.footer?.(options) ?? (
              <div class="w-popup-footer">
                <div>{ctx.slots['footer-prepend']?.(options)}</div>
                <div>
                  {cancelBtn(options)}
                  {okBtn(options)}
                </div>
              </div>
            ))
          return [header, body, footer, renderLoading()]
        }
      }

      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
