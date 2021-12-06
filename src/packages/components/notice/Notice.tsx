import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  Teleport,
  Transition,
  watch
} from 'vue'
import Icon from '../icon'
import { getBoundingClientRect } from '../../util'
import useGlobalZIndex from '../../use/useGlobalZIndex'
import Close from '../close'

export type NoticePlacementType = 'top' | 'bottom' | 'top-end' | 'bottom-end'

export type NoticeOptions = {
  content: any
  placement?: NoticePlacementType
  duration?: number
  manual?: boolean
  afterClose?: () => void
}

export default defineComponent({
  inheritAttrs: false,
  name: 'Notice',
  components: { Icon, Close },
  props: {
    show: { type: Boolean, default: false },
    placement: { type: String, default: 'top-end' },
    duration: { type: Number, default: 4500 }, //单位毫秒,多少秒后自动关闭
    manual: { type: Boolean, default: false } //是否手动控制关闭，也就是一直显示
  },
  emits: ['update:show', 'after-enter', 'after-leave', 'close'],
  setup(props, { emit, slots }) {
    // const { zIndex: order, add } = useGlobalZIndex()
    const noticeHeight = ref(0)
    const visible = ref(props.show)

    emit('close', close)
    watch(
      () => props.show,
      (s) => {
        visible.value = s
      }
    )
    watch(visible, (v) => {
      emit('update:show', v)
      if (v) {
        // add()
        if (!props.manual) {
          setTimeout(() => {
            visible.value = false
          }, props.duration)
        }
      }
    })

    onMounted(() => {
      visible.value = true
    })

    function close() {
      visible.value = false
    }

    return () => {
      const styles = {
        // order: order.value,
        // zIndex: order.value,
        '--__notice-item-height': noticeHeight.value
          ? noticeHeight.value + 'px'
          : ''
      }
      const klass = ['w-notice-item', `w-notice-item--${props.placement}`]
      return (
        <Transition
          name="w-notice-transition"
          onAfter-enter={(el: HTMLElement) => {
            noticeHeight.value = getBoundingClientRect(el).height
            emit('after-enter', el)
          }}
          onAfter-leave={(el: HTMLElement) => {
            emit('after-leave', el)
          }}>
          {visible.value && (
            <div style={styles} class={klass}>
              {slots.default?.()}
              <Close
                size="14"
                name="w-icon-close"
                class="w-notice-close"
                onClick={(e: any) => {
                  visible.value = false
                }}
              />
            </div>
          )}
        </Transition>
      )
    }
  }
})
