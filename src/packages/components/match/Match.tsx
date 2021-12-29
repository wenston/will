import { computed, ref, defineComponent, watch } from 'vue'
import type { RectType } from '../../config/types'
import Layer, { LayerProps } from '../layer/index'
import Write from '../write/index'
import Arrow from '../arrow/index'
import Close from '../close/index'
import Fallback from '../fallback/index'
import Virtual from '../virtual/index'
export default defineComponent({
  name: 'Match',
  inheritAttrs: false,
  components: { Write, Layer, Arrow, Close, Fallback, Virtual },
  props: {
    data: Array,
    placement: {
      ...LayerProps.placement,
      default: 'bottom-start'
    },
    gap: { type: LayerProps.gap.type, default: 2 },
    show: { type: Boolean, default: false },
    placeholder: { type: String, default: '请输入关键字' },
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    block: { type: Boolean },
    keyField: { type: String, default: 'Id' },
    textField: { type: String, default: 'Name' }
  },
  emits: ['update:show'],
  setup(props, ctx) {
    const transitionName = 'w-slide-y'
    const searchText = ref('')
    const triggerRect = ref<RectType>()
    const visible = ref(props.show)
    const layerContentStyle = computed(() => {
      if (triggerRect.value) {
        return { minWidth: triggerRect.value.width + 'px' }
      }
      return {}
    })
    const layerOptions = computed(() => {
      return {
        manual: true,
        hasArrow: false,
        transitionName,
        show: visible.value,
        gap: props.gap,
        layerClass: ['w-match-layer'],
        layerStyle: layerContentStyle.value,
        'onUpdate:show': (v: boolean) => {
          visible.value = v
        },
        placement: props.placement,

        'onGet-trigger-rect': (rect: RectType) => {
          triggerRect.value = rect
        }
      }
    })
    watch(
      () => props.show,
      (v) => {
        visible.value = v
      }
    )
    watch(visible, (v) => {
      ctx.emit('update:show', v)
    })
    function renderTrigger() {
      const writeOptions = {
        class: ['w-match', { 'w-match-block': props.block }],
        clearable: true,
        block: props.block,
        placeholder: props.placeholder,
        modelValue: searchText.value,
        'onUpdate:modelValue': (v: string, input: HTMLInputElement) => {
          console.log(v, input)
          searchText.value = v
        }
      }
      const writeSlots = {
        default: ({ focus }: { focus: () => void }) => {
          const arrowOptions = {
            class: 'w-cursor-pointer',
            rotate: visible.value,
            onClick: (e: MouseEvent) => {
              visible.value = !visible.value
              if (visible.value) {
                focus()
              }
            }
          }
          return <Arrow {...arrowOptions} />
        }
      }
      return <Write {...writeOptions} v-slots={writeSlots}></Write>
    }
    return () => {
      const layerSlots = {
        trigger: renderTrigger,
        default: () => {
          const items =
            props.data && props.data.length
              ? props.data.map((item: any, index: number) => {
                  const itemOptions = {
                    class: ['w-match-item']
                  }
                  return <div {...itemOptions}>{item[props.textField]}</div>
                })
              : null

          return items
        }
      }
      return <Layer {...layerOptions.value} v-slots={layerSlots} />
    }
  }
})
