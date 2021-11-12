import type { VNode } from 'vue'
import {
  defineComponent,
  computed,
  ref,
  Teleport,
  Transition,
  withDirectives,
  vShow,
  watch,
  onMounted
} from 'vue'
import useGlobalZIndex from '../../use/useGlobalZIndex'
export default defineComponent({
  props: {
    bind: { type: String, default: 'v-if' },
    zIndex: Number,
    show: { type: Boolean, default: false },
    canCloseByClickSelf: {
      type: Boolean,
      default: false
    },
    to: {
      type: HTMLElement,
      default: () => document.body
    }
  },
  emits: ['update:show', 'get-ref'],
  setup(props, { slots, emit }) {
    const root = ref(null)
    const { zIndex } = useGlobalZIndex()
    const visible = ref(props.show)
    watch(
      () => props.show,
      (v) => {
        visible.value = v
      }
    )
    watch(visible, (v) => {
      emit('update:show', v)
    })
    onMounted(() => {
      emit('get-ref', root)
    })
    const maskOptions = computed(() => {
      const o: any = {
        ref: root,
        class: 'w-mask',
        style: {
          '--__w-mask-z-index': props.zIndex || zIndex.value
        },
        onClick: (e: MouseEvent) => {
          if (e.target === root.value && props.canCloseByClickSelf) {
            visible.value = false
          }
        }
      }
      return o
    })
    return () => {
      let main: VNode | boolean = (
        <div {...maskOptions.value}>{slots.default?.()}</div>
      )
      if (props.bind === 'v-if') {
        main = visible.value && main
      } else if (props.bind === 'v-show') {
        main = withDirectives(main, [[vShow, visible.value]])
      }
      return (
        <Teleport to={props.to}>
          <Transition name="w-mask-fade">{main}</Transition>
        </Teleport>
      )
    }
  }
})
