import { computed, defineComponent, reactive, ref, watch } from 'vue'
import useToggleArray from '../../use/toggle/useToggleArray'
function isOn(v: string | boolean | number) {
  return Number(v) >= 1 || v === true
}
function isOff(v: string | boolean | number) {
  return Number(v) === 0 || v === false || v === undefined || v === null
}
function isInterceptProperty(prop: string): boolean {
  return ['width', 'height'].indexOf(prop) > -1
}
export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => [0, 1]
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: 0
    },
    disabled: Boolean,
    readonly: Boolean,
    //如果是String，则只是on状态下的颜色，如果是数组，则第二个颜色是控制阀的颜色
    onColor: { type: [String, Array] },
    offColor: [String, Array]
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, attrs, slots }) {
    const { item: value, toggle } = useToggleArray(
      props.data,
      reactive({ item: computed(() => props.modelValue) })
    )
    const _isOn = computed(() => isOn(value.value as any))
    function toToggle() {
      toggle()
      const _v = value.value
      emit('update:modelValue', _v)
      emit('change', _v)
    }
    const ps = computed(() => {
      //拦截style
      let _sty: any = {}
      let { style, klass, ...rest } = attrs
      let sty = style as any
      if (sty) {
        for (const pr in sty) {
          if (isInterceptProperty(pr)) {
            _sty[`--__switch-${pr}`] = sty[pr]
          } else {
            _sty[pr] = sty[pr]
          }
        }
      }
      const o: any = {
        class: [
          'w-switch',
          {
            'w-switch--on': _isOn.value,
            'w-switch--disabled': props.disabled
          },
          klass
        ],
        style: _sty,
        ...rest
      }
      if (props.onColor) {
        if (typeof props.onColor === 'string') {
          o.style['--__on-color'] = props.onColor
        } else {
          o.style['--__on-color'] = props.onColor[0]
          o.style['--__on-valve-color'] = props.onColor[1]
        }
      }
      if (props.offColor) {
        if (typeof props.offColor === 'string') {
          o.style['--__off-color'] = props.offColor
        } else {
          o.style['--__off-color'] = props.offColor[0]
          o.style['--__off-valve-color'] = props.offColor[1]
        }
      }
      if (!props.disabled && !props.readonly) {
        o.onClick = toToggle
      }
      return o
    })
    watch(
      () => props.modelValue,
      (v) => {
        value.value = v
      }
    )
    return () => {
      return <i {...ps.value}>{_isOn.value ? slots.on?.() : slots.off?.()}</i>
    }
  }
})
