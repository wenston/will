import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue'
import Tooltip from '../tooltip/index'
import useDrag from '../../use/useDrag'
import useMouse from '../../use/useMouse'
import { getBoundingClientRect, getOffset } from '../../util'

const getRootSize = (elem: HTMLElement) => {
  const rect = getBoundingClientRect(elem)
  return { width: rect.width, height: rect.height }
}

export default defineComponent({
  name: 'Slider',
  components: {
    Tooltip
  },
  props: {
    modelValue: { type: Number, default: 0 },
    //步长
    step: { type: Number, default: 2 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 30 },
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
    const { client } = useMouse({ mousemove: inMousemove, mouseup: inMouseup })
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
    //计算出所有值对应的宽度区间
    const widthRange = computed(() => {
      const len = all_steps_big.value.length - 1 || 1
      const averageWidth = rootSize.width / len
      const ranges: number[][] = []
      Array.from({ length: len }, (item, i) => {
        ranges.push([
          Math.ceil(i * averageWidth),
          Math.ceil((i + 1) * averageWidth)
        ])
      })
      return ranges
    })

    const dragging = ref(false)
    const currentXValue = ref(props.modelValue)
    const currentYValue = ref(0)
    const rod = ref()
    const root = ref<HTMLElement>()
    const rootSize = reactive({
      width: 0,
      height: 0
    })
    const dx = ref(0)
    const dy = ref(0)
    const pos = reactive({ left: 0, top: 0 })
    const display = ref(false)

    const tipContent = computed(() => {
      if (props.showTooltip) {
        return currentXValue.value / multiples
      }
    })

    watch(
      () => props.modelValue,
      (v) => {
        currentXValue.value = v
      }
    )
    watch(currentXValue, (v) => {
      emit('update:modelValue', v)
    })

    onMounted(() => {
      if (root.value) {
        ;({ width: rootSize.width, height: rootSize.height } = getRootSize(
          root.value
        ))
        console.log(rootSize)
      }
    })

    function startMousedown(e: MouseEvent) {
      if (root.value && rod.value) {
        const { left, top } = getOffset(rod.value, root.value)
        dx.value = client.x - left
        dy.value = client.y - top
      }
      dragging.value = true
    }

    function inMousemove(e: MouseEvent) {
      if (dragging.value) {
        let top = client.y - dy.value
        let left = client.x - dx.value

        if (left < 0) {
          left = 0
        }
        if (left > rootSize.width) {
          left = rootSize.width
        }
        //对left进行拦截，只定位在区域内
        const _left = getLeftByRange(left)
        if (_left !== undefined) {
          pos.left = _left.left
          currentXValue.value = all_steps_big.value[_left.i]
        }
        pos.top = top
      }
    }
    function inMouseup(e: MouseEvent) {
      dragging.value = false
    }

    function getLeftByRange(left: number) {
      if (left === rootSize.width) {
        return { left, i: all_steps_big.value.length - 1 }
      }
      let i = 0
      const len = widthRange.value.length
      while (i < len) {
        const [a, b] = widthRange.value[i]
        if (left >= a && left < b) {
          return {
            left: a,
            i
          }
        }
        i++
      }
    }

    return () => {
      let _rod = (
        <div
          class="w-slider-rod"
          ref={rod}
          style={{
            left: pos.left + 'px'
          }}>
          <Tooltip
            arrowOffset={{ x: -2, y: 0 }}
            placement="top"
            manual={true}
            realTime
            show={dragging.value || display.value}>
            {{
              trigger: () => (
                <div
                  class={'w-slider-for-tip'}
                  onMousedown={startMousedown}
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
      const progress = (
        <div class="w-slider-progress" style={{ width: pos.left + 'px' }}></div>
      )

      return (
        <div ref={root} class="w-slider">
          {progress}
          {_rod}
        </div>
      )
    }
  }
})
