import { defineComponent, reactive, computed } from 'vue'
import Icon from '../icon'
import useToggleArray from '../../use/toggle/useToggleArray'
export default defineComponent({
  props: {
    modelValue: {
      type: [Number, String]
    },
    value: [Number, String],
    disabled: Boolean,
    text: [Number, String]
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const symbol = computed(() => Symbol(props.value))
    const data = computed(() => [symbol.value, props.value])
    const isChecked = computed(() => props.modelValue === props.value)
    const { set } = useToggleArray(
      data,
      reactive({
        item: computed(() => (isChecked.value ? props.value : symbol.value))
      })
    )
    const iconProps = computed(() => {
      return {
        name: isChecked.value
          ? 'w-icon-radio-fill'
          : props.disabled
          ? 'w-icon-ball'
          : 'w-icon-radio',
        class: [
          'w-radio-icon',
          {
            'w-radio-icon-checked': isChecked.value,
            'w-radio-icon-disabled': props.disabled
          }
        ]
      }
    })
    return () => {
      const p: any = { class: 'w-radio' }
      if (!props.disabled) {
        p.onClick = (e: MouseEvent) => {
          set({ item: props.value })
          emit('update:modelValue', props.value)
          emit('change', isChecked.value)
        }
      }
      return (
        <span {...p}>
          <Icon {...iconProps.value} />
          {props.text ?? slots.default?.()}
        </span>
      )
    }
  }
})
