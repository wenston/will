import type { SetupContext, ComputedRef } from 'vue'
import { defineComponent, computed, reactive } from 'vue'
import Icon from '../icon'
import useToggleArray from '../../use/toggle/useToggleArray'
import { isArray } from '../../util'
export default defineComponent({
  components: { Icon },
  props: {
    modelValue: {
      //true false,0,1, any[]
      type: [Boolean, Number, Array],
      default: 0
    },
    disabled: Boolean,
    value: {
      type: [Number, String, Array],
      default: () => [0, 1]
    },
    text: String
  },
  emits: ['update:modelValue', 'change'],
  setup(props, ctx: SetupContext) {
    if (isArray(props.value)) {
      return checkone(props, ctx)
    }
    return more(props, ctx)
  }
})

function more(props: any, ctx: SetupContext) {
  const symbol = computed(() => Symbol(props.value))
  const data = computed(() => [symbol.value, props.value])
  const has = computed(() =>
    props.modelValue.some((v: any) => v === props.value)
  )
  const { toggle, item } = useToggleArray(
    data,
    reactive({
      item: computed(() => (has.value ? props.value : symbol.value))
    })
  )
  const isChecked = computed(() => item.value === props.value)
  const iconProps = useIconProps(isChecked, props)
  return () => {
    const p = {
      class: 'w-checkbox'
    } as any
    if (!props.disabled) {
      p.onClick = (e: MouseEvent) => {
        if (!props.disabled) {
          let arr = [...props.modelValue]
          toggle()
          if (isChecked.value) {
            arr.push(props.value)
          } else {
            arr = arr.filter((a) => a !== props.value)
          }
          ctx.emit('update:modelValue', arr)
          ctx.emit('change', isChecked.value)
        }
      }
    }
    return (
      <span {...p}>
        <Icon {...iconProps.value} />
        {props.text ?? ctx.slots.default?.()}
      </span>
    )
  }
}

function checkone(props: any, ctx: SetupContext) {
  const { toggle, item } = useToggleArray(
    computed(() => props.value),
    reactive({
      item: computed(() => props.modelValue)
    })
  )
  const iconProps = useIconProps(
    computed(() => item.value === 1 || item.value === true),
    props
  )
  return () => {
    const p = {
      class: 'w-checkbox'
    } as any
    if (!props.disabled) {
      p.onClick = (e: MouseEvent) => {
        if (!props.disabled) {
          toggle()
          ctx.emit('update:modelValue', item.value)
          ctx.emit('change', item.value)
        }
      }
    }
    return (
      <span {...p}>
        <Icon {...iconProps.value} />
        {props.text ?? ctx.slots.default?.()}
      </span>
    )
  }
}

function useIconProps(isChecked: ComputedRef<boolean>, props: any) {
  return computed(() => ({
    name: isChecked.value
      ? 'w-icon-checkbox-fill'
      : props.disabled
      ? 'w-icon-square'
      : 'w-icon-checkbox',
    class: [
      'w-checkbox-icon',
      {
        'w-checkbox-icon-checked': isChecked.value,
        'w-checkbox-icon-disabled': props.disabled
      }
    ]
  }))
}
