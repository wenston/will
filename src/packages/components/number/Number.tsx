import {
  defineComponent,
  ref,
  computed,
  readonly,
  watch,
  onMounted,
  onUnmounted
} from 'vue'
import Write from '../write/index'
import Tooltip from '../layer/index'
import Icon from '../icon/index'
import useCount from '../../use/useCount'
import { filterListeners } from '../../util'

export default defineComponent({
  inheritAttrs: false,
  components: { Write, Tooltip, Icon },
  emits: {
    'update:modelValue': null,
    change: (e: Event) => true
  },
  props: {
    modelValue: { type: [Number, String] },
    block: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    maxlength: [String, Number],
    width: String,
    max: Number,
    min: Number,
    step: { type: Number, default: 1 },
    hasBtn: { type: Boolean, default: true }
  },
  setup(props, ctx) {
    onMounted(() => {
      console.log('num 挂载')
    })
    onUnmounted(() => {
      console.log('num 卸载')
    })
    const { add, count, set } = useCount({
      init: computed(() => Number(props.modelValue) ?? 0)
    })
    const isZH = ref(false)
    const numberOptions = computed(() => {
      return {
        inputClass: 'w-number',
        block: props.block,
        readonly: props.readonly,
        disabled: props.disabled,
        modelValue: props.modelValue,
        width: props.width,
        'onUpdate:modelValue': (
          v: number | string | undefined,
          elem: HTMLInputElement
        ) => {
          emitValue(v, elem)
        },
        // onChange: (e: Event) => {
        //   const target = e.target as HTMLInputElement
        //   const v = toValidate(target)
        //   ctx.emit('change', e)
        // },
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
          if (!validOnKeypress(val, e.keyCode)) {
            e.preventDefault()
          }
        },
        onPaste: (e: ClipboardEvent) => {
          const elem = e.target as HTMLInputElement
          setTimeout(() => {
            toValidate(elem)
          })
        },
        ...filterListeners(ctx.attrs)
      }
    })

    function emitValue(
      v: number | string | undefined,
      inputElement: HTMLInputElement
    ) {
      ctx.emit('update:modelValue', v, inputElement)
    }

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
      if (v === '') {
        emitValue(undefined, elem)
        elem.value = ''
      } else {
        const _v = isOutofRange(Number(v))
        emitValue(_v, elem)
        elem.value = _v + ''
      }
      return elem.value
    }
    function toAdd(elem: HTMLInputElement) {
      add(props.step)
      emitValue(isOutofRange(count.value), elem)
    }
    function toMinus(elem: HTMLInputElement) {
      add(props.step * -1)

      emitValue(isOutofRange(count.value), elem)
    }
    function isOutofRange(v: number) {
      if (props.max !== undefined && v > props.max) {
        set(props.max)
        return props.max
      }
      if (props.min !== undefined && v < props.min) {
        set(props.min)
        return props.min
      }
      return v
    }

    watch(
      () => props.modelValue,
      (v) => {
        if (v === undefined || v === '') {
          set(0)
        } else {
          set(Number(v))
        }
        console.log(v)
      },
      { immediate: true }
    )

    return () => {
      if (props.hasBtn) {
        const writeSlots = {
          default: ({
            inputElement
          }: {
            inputElement: HTMLInputElement | undefined
          }) => {
            const disabledClass = { 'w-number-btn-disabled': props.disabled }

            const addBtnOptions: Record<string, any> = {
              class: ['w-number-btn w-number-btn-rotate', disabledClass],
              name: 'w-icon-sort-down'
            }
            const minusBtnOptions: Record<string, any> = {
              class: ['w-number-btn', disabledClass],
              name: 'w-icon-sort-down'
            }
            if (!props.disabled) {
              addBtnOptions.onClick = () => {
                toAdd(inputElement!)
              }
              minusBtnOptions.onClick = () => {
                toMinus(inputElement!)
              }
            }
            return (
              <div class="w-number-btn-wrapper">
                <Icon {...addBtnOptions} />
                <Icon {...minusBtnOptions} />
              </div>
            )
          }
        }
        return <Write {...numberOptions.value} v-slots={writeSlots}></Write>
      }
      return <Write {...numberOptions.value} />
    }
  }
})

//在键盘按下的时候进行初步的验证，拦截掉无效的输入，这种方式拦截不住中文输入法，
//中文输入的情况，需在compositionend里去规范
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
