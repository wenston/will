import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref
} from 'vue'
import Tooltip from '../tooltip/index'
import useDrag from '../../use/useDrag'

export default defineComponent({
  components: {
    Tooltip
  },
  props: {
    modelValue: { type: Number, default: 0 },
    //步长
    step: { type: Number, default: 1 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    showTooltip: { type: Boolean, default: true },
    tip: { type: Function }
  },
  emits: {
    input: (value: number, percent?: number) => {
      if (
        typeof value === 'number' &&
        (percent === undefined || typeof percent === 'number')
      ) {
        return true
      }
    }
  },
  setup(props, { emit }) {
    const rod = ref()
    const { left, top } = useDrag(rod, { x: true, y: false })
    const pos = computed(() => {
      return {
        left: left.value === undefined ? undefined : left.value + 'px',
        top: top.value === undefined ? undefined : top.value + 'px'
      }
    })

    return () => {
      console.log(pos.value)
      let flag: null | JSX.Element = null
      let _rod = <div class="w-slider-rod" ref={rod} style={pos.value}></div>
      const trigger = () => (
        <div class={'w-slider-for-tip'} style={pos.value}></div>
      )

      if (props.showTooltip) {
        flag = (
          <Tooltip placement="top" manual={true} show={true}>
            {{
              trigger,
              default: () => {
                if (props.tip && typeof props.tip === 'function') {
                  return props.tip(props.modelValue)
                }
                return props.modelValue
              }
            }}
          </Tooltip>
        )
      }
      return <div class="w-slider">{[flag, _rod]}</div>
    }
  }
})
