import type { VNode } from 'vue'
import { defineComponent, computed } from 'vue'
import useDate from '../../use/useDate'

export default defineComponent({
  props: {
    //传入的当前日期
    date: { type: [Number, Date, String] },
    //displayDate是展示的日期
    displayDate: { type: [Number, Date, String] },
    //from和to有值的时候，date和displayDate不要有值。
    from: Number,
    to: Number,
    //最大日期最小日期
    max: { type: [Number, Date, String] },
    min: { type: [Number, Date, String] }
  },
  emits: {
    'toggle-year': (year: number) => {
      return year >= 1700
    },
    'get-from-to': (from: number, to: number) => {
      if (from || to) {
        return true
      }
    }
  },
  setup(props, { emit, slots }) {
    const {
      isMinYearThanDate,
      isMaxYearThanDate,
      getYearsInPanel,
      yearPanelLength
    } = useDate(computed(() => props.displayDate))
    const { year: selectedYear } = useDate(computed(() => props.date))

    const list = computed(() => {
      if (props.from && props.to) {
        const a = Array.from(
          { length: yearPanelLength },
          (item, index) => index + props.from!
        )
        return a
      }
      return []
    })

    function compareDate(d: Date) {
      const min = props.min,
        max = props.max
      if (min || max) {
        let isMin = false,
          isMax = false
        if (min) {
          isMin = isMinYearThanDate(d, min)
        }
        if (max) {
          isMax = isMaxYearThanDate(d, max)
        }
        return isMin || isMax
      }
      return false
    }

    function renderYearList() {
      const { years: yearList, from, to } = getYearsInPanel()
      emit('get-from-to', props.from || from, props.to || to)
      let ms: VNode[] = []
      // console.log(list.value, yearList, from, to)
      for (const v of list.value.length ? list.value : yearList) {
        const isCur = new Date().getFullYear() === v
        const isSelected =
          props.date === undefined ? false : selectedYear.value === v
        const isDisabled = compareDate(new Date(v, 0))
        const p = {
          class: [
            'w-months-item',
            {
              'w-months-item-current': isCur,
              'w-months-item-selected': isSelected,
              'w-months-item-disabled': isDisabled
            }
          ],
          onClick: () => {
            if (isDisabled) {
              return
            }
            emit('toggle-year', v)
          }
        }
        ms.push(
          <div {...p}>{isCur ? [<span>{v}</span>, <span>今年</span>] : v}</div>
        )
      }
      return <div class="w-months">{ms}</div>
    }
    return renderYearList
  }
})
