import { computed, getCurrentInstance, mergeProps, ref, useAttrs } from 'vue'
import { defineComponent, onMounted, reactive, watch } from 'vue'
import type { PropType } from 'vue'
import type {
  DragDirection,
  PlacementType,
  AdjustmentPosition
} from '../../config/types'
import Tooltip from '../tooltip/index'
import Num from '../number/index'
import useDrag from '../../use/useDrag'
import useMouse from '../../use/useMouse'
import { getBoundingClientRect, getOffset } from '../../util'

const getRootSize = (elem: HTMLElement) => {
  const rect = getBoundingClientRect(elem)
  return { width: rect.width, height: rect.height }
}

export default defineComponent({
  // inheritAttrs: false,
  name: 'Slider',
  components: {
    Tooltip,
    Num
  },
  props: {
    modelValue: { type: Number, default: 0 },
    //步长
    step: { type: Number, default: 2 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 30 },
    showTooltip: { type: Boolean, default: true },
    tip: { type: Function },
    direction: {
      type: Object as PropType<DragDirection>,
      default: () => ({
        x: true,
        y: false
      })
    },
    fill: { type: Boolean, default: true }, //滑块滑动时，是否填充已经经过的区域
    hasInput: Boolean,
    invalidateTip: {
      type: String,
      default: '所输入的值无效，请拖动控制阀重新输入！'
    }
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
  setup(props, { emit, slots }) {
    const ins = getCurrentInstance()
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

    const dragging = ref(false)
    const currentXValue = ref(props.modelValue * multiples)
    const currentYValue = ref(props.modelValue * multiples)
    const inputValue = ref<number>()
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

    //计算出所有值对应的宽度区间,返回的宽度是百分比的宽
    const widthRange = computed(() => {
      const len = all_steps_big.value.length - 1
      const ranges = all_steps_big.value.map((v, i) => {
        return i / len
      })
      // console.log(ranges)
      return ranges
    })

    const tipContent = computed(() => {
      if (props.showTooltip) {
        const { x, y } = props.direction
        const xValue = currentXValue.value / multiples
        const yValue = currentYValue.value / multiples
        let v: any
        if (props.tip) {
          v = props.tip({ x: xValue, y: yValue })
        } else {
          if (x && y) {
            v = `${xValue}，${yValue}`
          } else {
            if (x) {
              v = xValue
            } else if (y) {
              v = yValue
            }
          }
        }

        return v
      }
    })
    const sliderOptions = computed(() => {
      let klass = ''
      const { x, y } = props.direction
      if (x && y) {
        klass = 'w-slider-xy'
      } else if (x) {
        klass = 'w-slider-x'
      } else if (y) {
        klass = 'w-slider-y'
      }
      return mergeProps(
        {
          class: ['w-slider', klass]
        },
        { ref: root }
      )
    })
    const tooltipOptions = computed(() => {
      const { x, y } = props.direction
      return {
        placement: (x ? 'top' : 'left') as PlacementType,
        adjustPosition: (x ? 'bottom' : 'right') as AdjustmentPosition,
        manual: true,
        realTime: true,
        show: (dragging.value || display.value) && props.showTooltip
      }
    })
    const showInvalidTip = ref(false)

    watch(
      () => props.modelValue,
      (v) => {
        const { x, y } = props.direction
        if (x && y) {
        } else {
          if (x) {
            currentXValue.value = v * multiples
          } else if (y) {
            currentYValue.value = v * multiples
          }
          inputValue.value = v
          setPositionByModelValue(v)
        }
      }
    )
    watch(currentXValue, (v) => {
      if (props.direction.x && !props.direction.y) {
        emit('update:modelValue', v / multiples)
      }
    })
    watch(currentYValue, (v) => {
      if (props.direction.y && !props.direction.x) {
        emit('update:modelValue', v / multiples)
      }
    })

    onMounted(() => {
      if (root.value) {
        setPositionByModelValue(props.modelValue)
      }
    })

    function startMousedown(e: MouseEvent) {
      if (root.value && rod.value) {
        const rect = getBoundingClientRect(root.value)
        rootSize.width = rect.width
        rootSize.height = rect.height
        const { left, top } = getOffset(rod.value, root.value)
        dx.value = client.x - left
        dy.value = client.y - top
      }
      dragging.value = true
    }

    function inMousemove(e: MouseEvent) {
      if (dragging.value) {
        const { x, y } = props.direction
        let top = client.y - dy.value
        let left = client.x - dx.value
        if (x) {
          let j = 0
          if (left < 0) {
            left = 0
          } else if (left > rootSize.width) {
            left = rootSize.width
          }
          const percentLeft = left / rootSize.width

          if (percentLeft === 1) {
            j = all_steps_big.value.length - 1
          } else if (percentLeft === 0) {
            j = 0
          } else {
            j = getPosByRange(percentLeft)
          }
          pos.left = widthRange.value[j]

          currentXValue.value = all_steps_big.value[j]
        }
        if (y) {
          let j = 0
          if (top < 0) {
            top = 0
          } else if (top > rootSize.height) {
            top = rootSize.height
          }
          const percentTop = top / rootSize.height

          if (percentTop === 1) {
            j = all_steps_big.value.length - 1
          } else if (percentTop === 0) {
            j = 0
          } else {
            j = getPosByRange(percentTop)
          }
          pos.top = widthRange.value[j]

          currentYValue.value = all_steps_big.value[j]
        }
        showInvalidTip.value = false
      }
    }
    function inMouseup(e: MouseEvent) {
      dragging.value = false
    }

    function getPosByRange(per: number, which: 'left' | 'top' = 'left') {
      const allWidthPercent = widthRange.value
      let _j = 0
      let i = 0
      const len = allWidthPercent.length
      if (per === 0) {
        return 0
      } else if (per === 1) {
        return len - 1
      }
      while (i < len) {
        const currentWidthPercent = allWidthPercent[i]
        if (per === currentWidthPercent) {
          _j = i
          break
        } else if (per < currentWidthPercent) {
          _j = i - 1
          break
        }
        i++
      }
      if (_j < 0) {
        _j = 0
      } else if (_j > len - 1) {
        _j = len - 1
      }
      return _j
    }

    function setPositionByModelValue(v: number) {
      const { x, y } = props.direction
      const allValue = all_steps_big.value.map((v) => v / multiples)
      const i = allValue.findIndex((_v) => _v === v)
      if (i > -1) {
        if (x) {
          pos.left = widthRange.value[i]
        } else if (y) {
          pos.top = widthRange.value[i]
        }
      }
    }

    function validateInput(v: number) {
      const allValues = all_steps_big.value.map((v) => v / multiples)
      return allValues.includes(v)
    }

    return () => {
      const { x, y } = props.direction
      const rodPosition: { left?: string; top?: string } = {}
      const progressSize: { width?: string; height?: string } = {}
      if (x) {
        rodPosition.left = pos.left * 100 + '%'
        progressSize.width = pos.left * 100 + '%'
      }
      if (y) {
        rodPosition.top = pos.top * 100 + '%'
        progressSize.height = pos.top * 100 + '%'
      }
      let _rod = (
        <div class="w-slider-rod" ref={rod} style={rodPosition}>
          <Tooltip {...tooltipOptions.value}>
            {{
              trigger: () => (
                <div
                  class={[
                    'w-slider-for-tip',
                    { 'rod-in-dragging': dragging.value }
                  ]}
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
      const progress = props.fill && (
        <div class="w-slider-progress" style={progressSize}></div>
      )

      const main = (
        <div {...sliderOptions.value}>
          {progress}
          {_rod}
        </div>
      )
      const num = () => (
        <Num
          has-btn={false}
          width="45px"
          max={props.max}
          min={props.min}
          step={props.step}
          modelValue={props.modelValue}
          onUpdate:modelValue={(v, elem) => {
            inputValue.value = v
          }}
          onKeyup={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v) && v !== undefined && e.key === 'Enter') {
              e.target.blur()
            }
          }}
          onBlur={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) {
              // inputValue.value = v

              if (validateInput(v)) {
                showInvalidTip.value = false
                setPositionByModelValue(v)
                emit('update:modelValue', v)
              } else {
                showInvalidTip.value = true
              }
            }
          }}
        />
      )

      //当x和y方向都能滑动的时候，不露出input输入框
      if (props.hasInput && (!x || !y)) {
        return (
          <div class="w-slider-has-input">
            {main}
            <Tooltip
              real-time
              manual
              placement="top"
              adjustPosition="bottom"
              show={showInvalidTip.value}>
              {{
                trigger: num,
                default: () => props.invalidateTip
              }}
            </Tooltip>
          </div>
        )
      } else {
        return main
      }
    }
  }
})
