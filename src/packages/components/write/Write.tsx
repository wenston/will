import { defineComponent, ref, computed, readonly, normalizeClass } from 'vue'
import { filterListeners, isValidValue } from '../../util'
import Close from '../close/index'
import Layer from '../layer/index'

export default defineComponent({
  inheritAttrs: false,
  components: { Close, Layer },
  emits: {
    'update:modelValue': null,
    clear: null
  },
  props: {
    modelValue: { type: [Number, String] },
    placeholder: { type: String },
    clearable: Boolean,
    block: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    maxlength: [String, Number],
    width: { type: String },
    inputClass: { type: [Object, Array, String] },
    //验证，未实现
    validate: {
      type: Object,
      default: () => ({
        when: 'blur', //验证时机
        condition: '',
        invalidTip: ''
      })
    }
  },
  setup(props, ctx) {
    const input = ref<HTMLInputElement>()
    const isZH = ref(false) //是否在输入中文
    const showCloseBtn = computed(() => {
      const v = props.modelValue
      return props.clearable && isValidValue(v)
    })
    const inputOptions = computed(() => {
      return {
        ref: input,
        class: ['w-write-input'],
        placeholder: props.placeholder,
        readonly: props.readonly,
        disabled: props.disabled,
        value: props.modelValue,
        maxlength: props.maxlength,
        onCompositionstart: (e: CompositionEvent) => {
          isZH.value = true
        },
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value
          if (!isZH.value) {
            ctx.emit('update:modelValue', val, input.value)
          }
        },
        onCompositionend: (e: CompositionEvent) => {
          setTimeout(() => {
            const val = (e.target as HTMLInputElement).value
            ctx.emit('update:modelValue', val, input.value)
            isZH.value = false
          })
        },
        ...filterListeners(ctx.attrs)
      }
    })
    const outerOptions = computed(() => {
      return {
        class: ['w-write', normalizeClass(ctx.attrs.class)]
      }
    })
    const layerOptions = computed(() => {
      return {
        manual: true
      }
    })
    function focus() {
      input.value?.focus()
    }
    function select() {
      input.value?.select()
    }
    ctx.expose({
      focus,
      select
    })
    return () => {
      const inputEl = <input {...inputOptions.value} />
      const inputWithLayer = (
        <Layer
          {...layerOptions.value}
          v-slots={{
            trigger: () => (
              <div
                style={{ width: props.width }}
                class={[
                  'w-write-wrapper',
                  normalizeClass(props.inputClass),
                  {
                    'w-write-input-block': props.block,
                    'w-write-input-disabled': props.disabled
                  }
                ]}>
                {ctx.slots.prepend?.()}
                {inputEl}
                {showCloseBtn.value && (
                  <Close
                    name="w-icon-close-fill"
                    onClick={(e: MouseEvent) => {
                      const options = { input: input.value }
                      ctx.emit('update:modelValue', undefined, input.value)
                      ctx.emit('clear', options)
                      e.stopPropagation()
                    }}
                  />
                )}
                {ctx.slots.default?.({
                  focus
                })}
              </div>
            ),
            default: () => '输入无效'
          }}
        />
      )
      return (
        <div {...outerOptions.value}>
          {ctx.slots.before?.()}
          {inputWithLayer}
          {ctx.slots.after?.()}
        </div>
      )
    }
  }
})
