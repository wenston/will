import { computed, defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { TimeFormatType } from '../../config/types'
import Trigger from '../trigger/index'
import Layer from '../layer/index'
import Dial from './Dial.vue'

const validate_hms = (hms?: string) => {
  if (hms === undefined) {
    return true
  } else {
    const len = hms.length
    const [_h, _m, _s] = hms.split(':')

    if (len === 2 || len === 5 || len === 8) {
      const h = +_h
      const isValidHour = h >= 0 && h < 24
      if (len === 2) {
        return isValidHour
      } else if (len === 5) {
        const m = +_m
        return isValidHour && m >= 0 && m < 60
      } else {
        const m = +_m
        const s = +_s
        return isValidHour && m >= 0 && m < 60 && s >= 0 && s < 60
      }
    }
    return false
  }
}

export default defineComponent({
  name: 'TimePicker',
  components: { Trigger, Layer, Dial },
  props: {
    show: { type: Boolean, default: false },
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    block: Boolean,
    placeholder: { type: [String, Object, Array], default: '请选择时间' },
    modelValue: {
      type: String,
      default: undefined,
      validator: validate_hms
    },
    format: { type: String as PropType<TimeFormatType>, default: 'HH:mm:ss' }
  },
  emits: ['update:show', 'update:modelValue'],
  setup(props, { slots, emit }) {
    const visible = ref(props.show)
    const text = computed(() => {
      return props.modelValue || ''
    })
    const layerOptions = computed(() => {
      return {
        immediate: true,
        show: visible.value,
        disabled: props.disabled,
        placement: 'bottom-start',
        gap: 2,
        hasArrow: false,
        transitionName: 'w-slide-y',
        layerClass: 'w-time-picker',
        'onUpdate:show': (b: boolean) => {
          visible.value = b
        }
      } as Record<any, any>
    })

    function clear() {
      emit('update:modelValue', undefined)
    }
    function renderTrigger() {
      const triggerOptions = {
        placeholder: props.placeholder,
        disabled: props.disabled,
        block: props.block,
        clearable: props.clearable,
        text: text.value,
        active: visible.value,
        onClear: () => {
          clear()
        }
      }
      return <Trigger {...triggerOptions} />
    }
    function renderContent() {
      return (
        <Dial
          format={props.format}
          value={props.modelValue}
          onChange={(v) => {
            emit('update:modelValue', v)
          }}
        />
      )
    }

    watch(
      () => props.show,
      (b: boolean) => {
        visible.value = b
      }
    )
    watch(visible, (b: boolean) => {
      emit('update:show', b)
    })

    return () => (
      <Layer {...layerOptions.value}>
        {{
          trigger: renderTrigger,
          default: renderContent
        }}
      </Layer>
    )
  }
})
