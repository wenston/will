import {
  // ref,
  createVNode,
  defineComponent,
  inject,
  computed,
  watchEffect
} from 'vue'
import {
  CurrentValueKey,
  // CurrentLabelKey,
  SetCurrentValueKey,
  SetCurrentLabelKey,
  ToCloseKey
} from './injectionKey'
export default defineComponent({
  props: {
    tag: { type: String, default: 'div' },
    value: { type: [Number, String], default: undefined },
    label: { type: [Number, String], default: undefined },
    disabled: { type: Boolean, default: false }
  },
  setup(props, { emit, slots }) {
    const currentValue = inject(
      CurrentValueKey,
      computed(() => undefined)
    )
    // const currentLabel = inject(CurrentLabelKey, ref(undefined))
    const setCurrentValue = inject(SetCurrentValueKey, () => {
      throw new Error('setCurrentValue出现问题，请检查')
    })
    const setCurrentLabel = inject(SetCurrentLabelKey, () => {
      throw new Error('setCurrentLabel出现问题，请检查')
    })
    const toClose = inject(ToCloseKey, () => {
      throw new Error('toClose出现问题，请检查')
    })
    const isActive = computed(() => {
      return (
        currentValue.value !== undefined && props.value === currentValue.value
      )
    })
    watchEffect(() => {
      if (isActive.value) {
        setCurrentLabel(props.label)
      }
    })
    return () => {
      const options: Record<string, any> = {
        class: [
          'w-choose-item',
          {
            'w-choose-item-active': isActive.value,
            'w-choose-item-disabled': props.disabled
          }
        ]
      }
      if (!props.disabled) {
        options.onClick = (e: MouseEvent) => {
          if (!isActive.value) {
            //注意顺序，否则Choose组件里的change事件的参数会有问题
            setCurrentLabel(props.label)
            setCurrentValue(props.value)
          }
          toClose()
        }
      }
      return createVNode(props.tag, options, slots.default?.())
    }
  }
})
