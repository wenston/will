import { defineComponent, ref, computed, readonly, normalizeClass } from 'vue'
import { filterListeners, isValidValue } from '../../util'
import Close from '../close/index'

export default defineComponent({
  inheritAttrs: false,
  components: { Close },
  emits: {
    'update:modelValue': null,
    clear: null
  },
  props: {
    modelValue: { type: [Number, String] },
    clearable: Boolean,
    block: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    maxlength: [String, Number],
    minlength: [String, Number]
  },
  setup(props, ctx) {
    const input = ref<HTMLInputElement>()
    const showCloseBtn = computed(() => {
      const v = props.modelValue
      return props.clearable && isValidValue(v)
    })
    const inputOptions = computed(() => {
      return {
        ref: input,
        class: ['w-write-input'],
        readonly: props.readonly,
        value: props.modelValue,
        maxlength: props.maxlength,
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          ctx.emit('update:modelValue', val)
        },
        ...filterListeners(ctx.attrs)
      }
    })
    const outerOptions = computed(() => {
      return {
        class: ['w-write', normalizeClass(ctx.attrs.class)]
      }
    })
    return () => {
      return (
        <div {...outerOptions.value}>
          {ctx.slots.before?.()}
          <div
            class={{
              'w-write-wrapper': true,
              'w-write-input-block': props.block
            }}>
            {ctx.slots.prepend?.()}
            <input {...inputOptions.value} />
            {showCloseBtn.value && (
              <Close
                name="w-icon-close-fill"
                onClick={(e: MouseEvent) => {
                  ctx.emit('update:modelValue', undefined)
                  const options = { input: input.value }
                  ctx.emit('clear', options)
                  e.stopPropagation()
                }}
              />
            )}
            {ctx.slots.default?.()}
          </div>

          {ctx.slots.after?.()}
        </div>
      )
    }
  }
})
