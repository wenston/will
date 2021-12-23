import { defineComponent, ref, computed, readonly, normalizeClass } from 'vue'
import Write from '../write/index'
import Tooltip from '../layer/index'
import Icon from '../icon/index'

export default defineComponent({
  inheritAttrs: false,
  components: { Write, Tooltip, Icon },
  emits: {
    'update:modelValue': null,
    clear: null
  },
  props: {
    modelValue: { type: [Number, String] },
    block: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    maxlength: [String, Number],
    max: Number,
    min: Number
  },
  setup(props, ctx) {
    const isZH = ref(false)
    const numberOptions = computed(() => {
      return {
        inputClass: 'w-number',
        block: props.block,
        readonly: props.readonly,
        disabled: props.disabled,
        modelValue: props.modelValue,
        'onUpdate:modelValue': (
          v: number | string | undefined,
          elem: HTMLInputElement
        ) => {
          setTimeout(() => {
            toValidate(elem)
          })
        },
        onCompositionstart: (e: CompositionEvent) => {
          isZH.value = true
        },
        onCompositionend: (e: CompositionEvent) => {
          const elem = e.target as HTMLInputElement
          setTimeout(() => {
            toValidate(elem)
            isZH.value = false
          })
        },
        onKeypress: (e: KeyboardEvent) => {
          const val = (e.target as HTMLInputElement).value
          // console.log(val, { key: e.key, code: e.keyCode })
          if (!validOnKeypress(val, e.keyCode)) {
            e.preventDefault()
          }
        },
        onPaste: (e: ClipboardEvent) => {
          const elem = e.target as HTMLInputElement
          setTimeout(() => {
            toValidate(elem)
          })
        }
      }
    })

    function toValidate(elem: HTMLInputElement) {
      let v = elem.value
      if (v !== undefined) {
        v += ''
        const validValue = (v as string).match(/(-?\d+\.?)(\d+)?/g)
        if (v !== '-') {
          if (validValue !== null) {
            v = validValue[0]
          } else {
            v = ''
          }
        }
      }
      ctx.emit('update:modelValue', v)
      elem.value = v || ''
    }

    return () => {
      const writeSlots = {
        default: () => {
          return (
            <div class="w-number-btn-wrapper">
              <Icon
                class="w-number-btn w-number-btn-rotate"
                name="w-icon-sort-down"
              />
              <Icon class="w-number-btn" name="w-icon-sort-down" />
            </div>
          )
        }
      }
      return <Write {...numberOptions.value} v-slots={writeSlots}></Write>
    }
  }
})

//在键盘按下的时候进行初步的验证，拦截掉无效的输入
function validOnKeypress(val: string, keyCode: number) {
  let b = false
  //首次按下键盘
  if (val === '') {
    //如果是负号、数字，则认为是有效
    if (isNumberCode(keyCode) || isMinusCode(keyCode)) {
      b = true
    }
    //第二次按下键盘
  } else if (val.length === 1) {
    if (val === '-') {
      if (isNumberCode(keyCode)) {
        b = true
      }
    } else if (isNumberVal(val)) {
      if (isNumberCode(keyCode) || isDotCode(keyCode)) {
        b = true
      }
    }
    //第三次及更多次按下键盘时
  } else {
    if (hasDot(val)) {
      if (isNumberCode(keyCode)) {
        b = true
      }
    } else {
      if (isNumberCode(keyCode) || isDotCode(keyCode)) {
        b = true
      }
    }
  }
  return b
}

function isNumberCode(keyCode: number) {
  return keyCode < 58 && keyCode > 47
}
function isMinusCode(keyCode: number) {
  return keyCode === 45
}
function isDotCode(keyCode: number) {
  return keyCode === 46
}

function isNumberVal(val: string) {
  return /\d/.test(val)
}

function hasDot(val: string) {
  return val.indexOf('.') > -1
}
