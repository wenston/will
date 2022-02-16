import {
  ref,
  computed,
  watch,
  defineComponent,
  Transition,
  vShow,
  withDirectives
} from 'vue'
import Icon from '../icon/index'
// import type { LoadingComponentProps } from './type'
export default defineComponent({
  props: {
    ...Icon.props,
    size: {
      type: String,
      default: '15px'
    },
    show: { type: Boolean, default: false },
    text: { type: String, default: '努力加载中...' },
    hasTransition: { type: Boolean, default: true },
    transitionName: { type: String, default: 'w-scale' }
  },
  emits: ['update:show', 'update:text'],
  setup(props, { slots, emit, expose }) {
    const root = ref<HTMLElement>()
    const _show = ref(props.show)
    const _text = ref(props.text)
    const _zIndex = ref<string | number | null>(null)

    const wrapperOptions = computed(() => {
      return {
        class: 'w-loading',
        ref: root,
        style: {
          'z-index': _zIndex.value
        } as Record<any, any>
      }
    })
    const iconOptions = computed(() => {
      return {
        name: props.name || 'w-icon-loading',
        color: props.color,
        class: 'w-loading-icon',

        style: {
          '--w-loading-icon-size': props.size
        }
      }
    })
    function show() {
      _show.value = true
    }
    function hide() {
      _show.value = false
    }
    function setText(text: string) {
      _text.value = text
    }
    function setZIndex(i: string | null) {
      _zIndex.value = i
      root.value?.style.setProperty('zIndex', i)
    }
    expose({ show, hide, setText, setZIndex })

    watch(_show, (v) => {
      emit('update:show', v)
    })
    watch(
      () => props.show,
      (v) => {
        _show.value = v
      }
    )
    watch(
      () => props.text,
      (v) => {
        _text.value = v
      }
    )
    watch(_text, (t) => {
      emit('update:text', t)
    })
    return () => {
      let comp = withDirectives(
        <div {...wrapperOptions.value}>
          {slots.default?.() ?? (
            <>
              <Icon {...iconOptions.value} />
              {props.text && <div class="w-loading-text">{_text.value}</div>}
            </>
          )}
        </div>,
        [[vShow, _show.value]]
      )
      if (props.hasTransition) {
        comp = <Transition name={props.transitionName}>{comp}</Transition>
      }
      return comp
    }
  }
})
