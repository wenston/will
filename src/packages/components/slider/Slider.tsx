import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import Tooltip from '../tooltip/index'
import useDrag from '../../use/useDrag'

export default defineComponent({
  name: 'Slider',
  components: {
    Tooltip
  },
  props: {
    modelValue: { type: Number, default: 5 },
    //步长
    step: { type: Number, default: 5 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 20 },
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
    },
    'update:modelValue': (v: number) => {
      return typeof v === 'number'
    }
  },
  setup(props, { emit }) {
    const multiples = 10000
    //由于可能存在小数的情况，而小数情况下，当有加减计算时，会出现类似0.1+0.2!=0.3的情况，故
    //对step/min/max进行10000倍的放大，然后再计算
    //TODO: 可以对这种计算（加/减，比较大小等）进行模块化封装
    const step_big = computed(() => multiples * props.step)
    const min_big = computed(() => multiples * props.min)
    const max_big = computed(() => multiples * props.max)
    //根据最大最小值和步长，算出所有存在的值
    const all_steps_big = computed(() => {
      const arr: number[] = []
      let i = min_big.value
      while (i <= max_big.value) {
        arr.push(i)
        i += step_big.value
      }
      if (arr[arr.length - 1] !== max_big.value) {
        arr.push(max_big.value)
      }
      return arr
    })
    const currentXValue = ref(props.modelValue)
    const currentYValue = ref(0)
    const rod = ref()
    const display = ref(false)
    const { left, top, leftPercent, topPercent, dragging } = useDrag(rod, {
      x: true,
      y: false,
      limit: true,
      meddle: meddlePosition
    })
    const pos = computed(() => {
      return {
        left: left.value === undefined ? undefined : left.value + 'px',
        top: top.value === undefined ? undefined : top.value + 'px'
      }
    })
    const tipContent = computed(() => {
      if (props.showTooltip) {
        const curX = Math.floor(
          leftPercent.value * (max_big.value - min_big.value)
        )
        // console.log(Math.floor(curX / multiples))
        currentXValue.value = Math.floor(curX / multiples)

        // console.log(curX)
        // const n = getMatchNumber(curX, all_steps_big.value)
        // console.log(n)
        // if (n !== false) {
        //   currentXValue.value = n / multiples
        // }
        return currentXValue.value
      }
    })

    // watchEffect(() => {
    //   if (leftPercent.value !== undefined && dragging.value) {
    //     console.log(Math.floor(leftPercent.value * 100))
    //   }
    // })

    function meddlePosition({ left, top }: { left?: number; top?: number }) {
      let _l = left,
        _t = top

      return { left: _l, top: _t }
    }

    watch(
      () => props.modelValue,
      (v) => {
        currentXValue.value = v
      }
    )
    watch(currentXValue, (v) => {
      emit('update:modelValue', v)
    })

    return () => {
      let _rod = (
        <div class="w-slider-rod" ref={rod} style={pos.value}>
          <Tooltip
            placement="top"
            manual={true}
            realTime
            show={dragging.value || display.value}>
            {{
              trigger: () => (
                <div
                  class={'w-slider-for-tip'}
                  onMouseenter={() => {
                    display.value = true
                  }}
                  onMouseleave={() => {
                    display.value = false
                  }}></div>
              ),
              default: () => tipContent.value
            }}
          </Tooltip>
        </div>
      )

      return <div class="w-slider">{_rod}</div>
    }
  }
})

function getMatchNumber(n: number, arr: number[]): number | false {
  const index = arr.findIndex((_n) => n < _n)
  if (index === 0) {
    return arr[index]
  }
  if (index > -1) {
    console.log(arr[index - 1])
    return arr[index - 1]
  }
  return false
}
